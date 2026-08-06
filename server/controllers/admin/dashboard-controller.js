const Order = require('../../models/Order');
const Product = require('../../models/products');
const User = require('../../models/User');

// NOTE: orderDate/totalAmount are stored as String in the Order schema
// (this is how the original tutorial project defined them), so we parse
// them here in JS rather than relying on Mongo aggregation date/number
// operators, which expect real Date/Number fields.

const getDashboardStats = async (req, res) => {
    try {
        const [orders, totalProducts, totalUsers] = await Promise.all([
            Order.find({}),
            Product.countDocuments(),
            User.countDocuments()
        ]);

        const paidOrders = orders.filter(o => o.paymentStatus === 'paid');

        const totalRevenue = paidOrders.reduce(
            (sum, o) => sum + (parseFloat(o.totalAmount) || 0),
            0
        );

        const totalOrders = orders.length;

        // orders grouped by status
        const statusCounts = {};
        orders.forEach(o => {
            const status = o.orderStatus || 'unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count
        }));

        // revenue for the last 7 days (paid orders only)
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
        }

        const revenueByDay = days.map(day => {
            const revenue = paidOrders
                .filter(o => {
                    const orderDay = new Date(o.orderDate).toISOString().slice(0, 10);
                    return orderDay === day;
                })
                .reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

            return { date: day, revenue: Number(revenue.toFixed(2)) };
        });

        // top selling products by quantity (paid orders only)
        const productSales = {};
        paidOrders.forEach(order => {
            (order.cartItems || []).forEach(item => {
                const key = item.productId;
                if (!productSales[key]) {
                    productSales[key] = { title: item.title, quantity: 0, revenue: 0 };
                }
                productSales[key].quantity += item.quantity;
                productSales[key].revenue += (parseFloat(item.price) || 0) * item.quantity;
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5)
            .map(p => ({
                title: p.title,
                quantity: p.quantity,
                revenue: Number(p.revenue.toFixed(2))
            }));

        // low stock alert list
        const lowStockProducts = await Product.find({ totalStock: { $lt: 10 } })
            .select('title totalStock')
            .sort({ totalStock: 1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue: Number(totalRevenue.toFixed(2)),
                totalOrders,
                totalProducts,
                totalUsers,
                ordersByStatus,
                revenueByDay,
                topProducts,
                lowStockProducts
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some Error Occured!'
        });
    }
};

module.exports = { getDashboardStats };
