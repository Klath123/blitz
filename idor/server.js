import express from "express";
import crypto from "crypto";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// ----------------------------
// Fake user database
// ----------------------------

const users = {

    alice: {
        id: 1,
        username: "alice",
        password: "alice123"
    },

    bob: {
        id: 2,
        username: "bob",
        password: "bob123"
    }

};


// ----------------------------
// Fake invoice database
// ----------------------------

const invoices = {

    1001: {
        id: 1001,
        owner: 1,
        item: "Shipping Container",
        amount: "$120"
    },

    1002: {
        id: 1002,
        owner: 1,
        item: "Warehouse Storage",
        amount: "$450"
    },

    1003: {
        id: 1003,
        owner: 2,
        item: "Fuel Charge",
        amount: "$90"
    },

    // FLAG INVOICE
    1337: {
        id: 1337,
        owner: 999,
        item: "CLASSIFIED",
        amount: "$0",
        note: "blitz{1d0r_1s_d4ng3r0us}"
    }

};


// ----------------------------
// Session storage
// ----------------------------

const sessions = {};


// ----------------------------
// Login endpoint
// ----------------------------

app.post("/api/login", (req, res) => {

    const { username, password } = req.body;

    const user = users[username];

    if (!user || user.password !== password) {

        return res.status(401).json({
            error: "Invalid credentials"
        });

    }

    const token = crypto
        .randomBytes(16)
        .toString("hex");

    sessions[token] = user.id;

    res.json({
        token,
        message: "Login successful"
    });

});


// ----------------------------
// Current user info endpoint
// ----------------------------

app.get("/api/me", (req, res) => {

    const token = req.headers.authorization;

    if (!token || !sessions[token]) {

        return res.status(401).json({
            error: "Unauthorized"
        });

    }

    res.json({
        userId: sessions[token]
    });

});


// ----------------------------
// Invoice endpoint (IDOR VULNERABLE)
// ----------------------------

app.get("/api/invoice", (req, res) => {

    const token = req.headers.authorization;

    if (!token || !sessions[token]) {

        return res.status(401).json({
            error: "Login required"
        });

    }

    const invoiceId = req.query.id;

    const invoice = invoices[invoiceId];

    if (!invoice) {

        return res.status(404).json({
            error: "Invoice not found"
        });

    }

    // VULNERABILITY HERE:
    // No ownership check
    // Should be:
    // if(invoice.owner !== sessions[token]) deny access

    res.json({
        id: invoice.id,
        item: invoice.item,
        amount: invoice.amount,
        note: invoice.note || null
    });

});


// ----------------------------
// Optional: list invoices for logged in user
// ----------------------------

app.get("/api/invoices", (req, res) => {

    const token = req.headers.authorization;

    if (!token || !sessions[token]) {

        return res.status(401).json({
            error: "Login required"
        });

    }

    const userId = sessions[token];

    const result = Object.values(invoices)
        .filter(inv => inv.owner === userId)
        .map(inv => inv.id);

    res.json({
        invoices: result
    });

});


// ----------------------------
// Health check
// ----------------------------

app.get("/api/health", (req, res) => {

    res.json({
        status: "running"
    });

});


// ----------------------------
// Start server
// ----------------------------

const PORT = 3020;

app.listen(PORT, () => {

    console.log(`Blitz Logistics API running on port ${PORT}`);

});
