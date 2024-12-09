import { PrismaClient } from "@prisma/client";
import { createWallet } from "../services/walletService.js";
import { createFiatWallet } from "../services/fiatWalletService.js";
const prisma = new PrismaClient();

export const buyCryptoWithFiat = async (req, res) => {
  const { userId, walletuser_id } = req.user;
  const { cryptoId, fiat_id, quantity, pricePerUnit } = req.body;

  try {
    let receiverWallet = await prisma.wallet.findFirst({
      where: {
        walletuser_id: walletuser_id,
        crypto_id: cryptoId,
      },
    });

    if (!receiverWallet) {
      const wallet = await createWallet(walletuser_id, cryptoId);
    }
    // คำนวณยอดเงินที่ต้องจ่าย
    const totalCost = quantity * pricePerUnit;

    // ตรวจสอบยอดเงินใน FiatWallet
    const buyerFiatWallet = await prisma.fiatWallet.findFirst({
      where: {
        walletuser_id: walletuser_id,
        fiat_id: fiat_id, // ตรวจสอบจาก fiat_id
      },
    });

    if (!buyerFiatWallet || buyerFiatWallet.balance < totalCost) {
      return res.status(400).json({ error: "Insufficient Fiat balance" });
    }

    // สร้างคำสั่งซื้อ
    const newOrder = await prisma.order.create({
      data: {
        user_id: 1,
        crypto_id: cryptoId,
        fiat_id: fiat_id, // เพิ่ม fiat_id ใน order
        order_type: "Buy",
        quantity,
        price_per_unit: pricePerUnit,
        status: "Pending",
      },
    });

    // หักยอดเงินใน FiatWallet
    await prisma.fiatWallet.update({
      where: { wallet_id: buyerFiatWallet.wallet_id },
      data: { balance: buyerFiatWallet.balance - totalCost },
    });

    // จับคู่คำสั่งขาย
    const matchingSellOrders = await prisma.order.findMany({
      where: {
        crypto_id: cryptoId,
        fiat_id: fiat_id, // ตรวจสอบ fiat_id ให้ตรงกัน
        order_type: "Sell",
        price_per_unit: { lte: pricePerUnit }, // ราคาขาย <= ราคาที่เสนอซื้อ
        status: "Pending",
      },
      orderBy: { price_per_unit: "asc" }, // เรียงจากราคาต่ำสุด
    });

    let remainingQuantity = quantity;

    /////////////////////////////////////////////////////////////////////////
    for (const sellOrder of matchingSellOrders) {
      const matchQuantity = Math.min(remainingQuantity, sellOrder.quantity);
      const priceDifference = pricePerUnit - sellOrder.price_per_unit;

      // อัปเดตเฉพาะส่วนที่จับคู่ (ให้ Sell Order เปลี่ยนสถานะเป็น Completed เฉพาะปริมาณที่จับคู่จนหมด)
      await prisma.order.update({
        where: { order_id: sellOrder.order_id },
        data: {
          quantity: sellOrder.quantity - matchQuantity,
          status:
            sellOrder.quantity - matchQuantity === 0 ? "Completed" : "Pending",
        },
      });

      const user = await prisma.user.findUnique({
        where: { user_id: sellOrder.user_id },
      });

      if (user) {
        const sellerWallet = await prisma.fiatWallet.findFirst({
          where: {
            walletuser_id: user.walletuser_id,
            fiat_id: fiat_id,
          },
        });

        if (sellerWallet) {
          await prisma.fiatWallet.update({
            where: { wallet_id: sellerWallet.wallet_id },
            data: { balance: sellerWallet.balance + matchQuantity },
          });
        }
      } else {
        console.log("User not found.");
      }

      // ตรวจสอบ Wallet การโอน Cryptocurrency และ Fiat
      const buyerWallet = await prisma.wallet.findFirst({
        where: { walletuser_id: walletuser_id, crypto_id: cryptoId },
      });

      if (buyerWallet) {
        await prisma.wallet.update({
          where: { wallet_id: buyerWallet.wallet_id },
          data: { balance: buyerWallet.balance + matchQuantity },
        });
      }
      ///////คืนเงินให้กับผู้ซื้อถ้าเจอที่ถูกกว่า///////////////
      if (priceDifference > 0) {
        const refundAmount = priceDifference * matchQuantity; // คำนวณจำนวนเงินคืนจากส่วนต่าง
        const buyerFiatWallet = await prisma.fiatWallet.findFirst({
          where: { walletuser_id, walletuser_id },
        });

        if (buyerFiatWallet) {
          await prisma.fiatWallet.update({
            where: { wallet_id: buyerFiatWallet.wallet_id },
            data: { balance: buyerFiatWallet.balance + refundAmount },
          });
          await prisma.order.update({
            where: { order_id: newOrder.order_id },
            data: {
              price_per_unit: pricePerUnit - priceDifference,
            },
          });

          console.log(`Refunded ${refundAmount} to buyer's fiat wallet`);
        }
      }

      remainingQuantity -= matchQuantity;

      if (remainingQuantity <= 0) break;
    }
    //////////////////////////////////////////////////////

    // อัปเดตสถานะคำสั่งซื้อ
    await prisma.order.update({
      where: { order_id: newOrder.order_id },
      data: {
        quantity: remainingQuantity,
        status: remainingQuantity === 0 ? "Completed" : "Pending",
      },
    });

    return res
      .status(200)
      .json({ message: "Buy order processed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//////////////////////////////////////////////
export const sellCryptoWithFiat = async (req, res) => {
  const { userId, walletuser_id } = req.user;
  const { cryptoId, fiat_id, quantity, pricePerUnit } = req.body;

  try {

    let receiverWallet = await prisma.fiatWallet.findFirst({
        where: {
          walletuser_id: walletuser_id,
          fiat_id: fiat_id,
        },
      });
  
      if (!receiverWallet) {
        const wallet = await createFiatWallet(walletuser_id, fiat_id);
      }
    // ตรวจสอบยอดใน Wallet Cryptocurrency
    const sellerCryptoWallet = await prisma.wallet.findFirst({
      where: {
        walletuser_id: walletuser_id,
        crypto_id: cryptoId,
      },
    });

    if (!sellerCryptoWallet || sellerCryptoWallet.balance < quantity) {
      return res.status(400).json({ error: "Insufficient Crypto balance" });
    }

    // สร้างคำสั่งขาย
    const newOrder = await prisma.order.create({
      data: {
        user_id: userId,
        crypto_id: cryptoId,
        fiat_id: fiat_id,
        order_type: "Sell",
        quantity,
        price_per_unit: pricePerUnit,
        status: "Pending",
      },
    });

    // หักยอด Cryptocurrency จาก Wallet
    await prisma.wallet.update({
      where: { wallet_id: sellerCryptoWallet.wallet_id },
      data: { balance: sellerCryptoWallet.balance - quantity },
    });

    // จับคู่คำสั่งซื้อ
    const matchingBuyOrders = await prisma.order.findMany({
      where: {
        crypto_id: cryptoId,
        fiat_id: fiat_id,
        order_type: "Buy",
        price_per_unit: { gte: pricePerUnit }, // ราคาซื้อ >= ราคาที่เสนอขาย
        status: "Pending",
      },
      orderBy: { price_per_unit: "desc" }, // เรียงจากราคาสูงสุด
    });

    let remainingQuantity = quantity;

    /////////////////////////////////////////////////////////////////////////
    for (const buyOrder of matchingBuyOrders) {
      const matchQuantity = Math.min(remainingQuantity, buyOrder.quantity);
      const priceDifference = buyOrder.price_per_unit - pricePerUnit;

      // อัปเดตเฉพาะส่วนที่จับคู่ (ให้ Buy Order เปลี่ยนสถานะเป็น Completed เฉพาะปริมาณที่จับคู่จนหมด)
      await prisma.order.update({
        where: { order_id: buyOrder.order_id },
        data: {
          quantity: buyOrder.quantity - matchQuantity,
          status:
            buyOrder.quantity - matchQuantity === 0 ? "Completed" : "Pending",
        },
      });

      const buyer = await prisma.user.findUnique({
        where: { user_id: buyOrder.user_id },
      });

      if (buyer) {
        const buyerWallet = await prisma.wallet.findFirst({
          where: {
            walletuser_id: buyer.walletuser_id,
            crypto_id: cryptoId,
          },
        });

        if (buyerWallet) {
          await prisma.wallet.update({
            where: { wallet_id: buyerWallet.wallet_id },
            data: { balance: buyerWallet.balance + matchQuantity },
          });
        }
      } else {
        console.log("Buyer not found.");
      }

      // เพิ่มยอดเงิน Fiat ให้ผู้ขาย
      const sellerFiatWallet = await prisma.fiatWallet.findFirst({
        where: { walletuser_id, fiat_id: fiat_id },
      });

      if (sellerFiatWallet) {
        await prisma.fiatWallet.update({
          where: { wallet_id: sellerFiatWallet.wallet_id },
          data: {
            balance: sellerFiatWallet.balance + matchQuantity * pricePerUnit,
          },
        });
      }

      /////// เก็บส่วนต่าง (กำไรจากราคาสูงกว่า) //////////
      console.log(priceDifference);

      if (priceDifference > 0) {
        const profitAmount = priceDifference * matchQuantity; // คำนวณกำไร
        const sellFiatWallet = await prisma.fiatWallet.findFirst({
          where: { walletuser_id: walletuser_id, fiat_id: fiat_id },
        });

        if (sellFiatWallet) {
          await prisma.fiatWallet.update({
            where: { wallet_id: sellFiatWallet.wallet_id },
            data: { balance: sellFiatWallet.balance + profitAmount },
          });

          await prisma.order.update({
            where: { order_id: newOrder.order_id },
            data: {
              price_per_unit: pricePerUnit + priceDifference,
            },
          });
          console.log(
            `Collected ${profitAmount} from buyer's fiat wallet for higher price`
          );
        }
      }

      remainingQuantity -= matchQuantity;

      if (remainingQuantity <= 0) break;
    }
    //////////////////////////////////////////////////////

    // อัปเดตสถานะคำสั่งขาย
    await prisma.order.update({
      where: { order_id: newOrder.order_id },
      data: {
        quantity: remainingQuantity,
        status: remainingQuantity === 0 ? "Completed" : "Pending",
      },
    });

    return res
      .status(200)
      .json({ message: "Sell order processed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

////////////////////////////////////////////////////////////////////////////////////
export const cancelOrder = async (req, res) => {
  const { userId, walletuser_id } = req.user;
  const { orderId } = req.body; // ID คำสั่งซื้อที่ต้องการยกเลิก

  try {
    // ดึงคำสั่งซื้อจากฐานข้อมูล
    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
    });

    // ตรวจสอบว่าคำสั่งซื้อมีอยู่หรือไม่
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // ตรวจสอบสิทธิ์การยกเลิก (ผู้ใช้ต้องเป็นเจ้าของคำสั่งซื้อ)
    if (order.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to cancel this order" });
    }

    // ตรวจสอบสถานะคำสั่งซื้อ (ยกเลิกได้เฉพาะคำสั่งที่ยัง Pending)
    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({ error: "Only pending orders can be canceled" });
    }

    // คืนยอดเงินหรือ Crypto ให้ผู้ใช้ตามประเภทคำสั่ง
    if (order.order_type === "Buy") {
      // คืนเงิน Fiat สำหรับคำสั่งซื้อ
      const buyerFiatWallet = await prisma.fiatWallet.findFirst({
        where: {
          walletuser_id: walletuser_id,
          fiat_id: order.fiat_id,
        },
      });

      if (buyerFiatWallet) {
        const refundAmount = order.quantity * order.price_per_unit;
        await prisma.fiatWallet.update({
          where: { wallet_id: buyerFiatWallet.wallet_id },
          data: { balance: buyerFiatWallet.balance + refundAmount },
        });
      }
    } else if (order.order_type === "Sell") {
      // คืน Crypto สำหรับคำสั่งขาย
      const sellerCryptoWallet = await prisma.wallet.findFirst({
        where: {
          walletuser_id: walletuser_id,
          crypto_id: order.crypto_id,
        },
      });

      if (sellerCryptoWallet) {
        await prisma.wallet.update({
          where: { wallet_id: sellerCryptoWallet.wallet_id },
          data: { balance: sellerCryptoWallet.balance + order.quantity },
        });
      }
    }

    // อัปเดตสถานะคำสั่งซื้อเป็น "Canceled"
    await prisma.order.update({
      where: { order_id: orderId },
      data: { status: "Canceled" },
    });

    return res
      .status(200)
      .json({ message: "Order has been successfully canceled." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
