import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// -------------------------
// Secret configuration
// -------------------------

const FLAG = "blitz{dual_hash_split_master}";
const REAL_KEY = "X7A9K2";

// Split key
const FIRST_HALF = REAL_KEY.slice(0, 3); // X7A
const LAST_HALF  = REAL_KEY.slice(3, 6); // 9K2

// Hash first half with MD5
const FIRST_HASH_MD5 = crypto
    .createHash("md5")
    .update(FIRST_HALF)
    .digest("hex");

// Hash last half with SHA1
const LAST_HASH_SHA1 = crypto
    .createHash("sha1")
    .update(LAST_HALF)
    .digest("hex");


// -------------------------
// Rate limiting
// -------------------------

const attempts = new Map();

function isRateLimited(ip) {

    const now = Date.now();

    const record = attempts.get(ip) || {
        count: 0,
        start: now
    };

    if (now - record.start > 60000) {
        record.count = 0;
        record.start = now;
    }

    record.count++;
    attempts.set(ip, record);

    return record.count > 100;
}


// -------------------------
// INFO endpoint
// -------------------------

app.get("/api/info", (req, res) => {

    res.json({

        system: "Dual Hash Validator v1.0",

        key_length: 6,

        charset: "A-Z0-9",

        first_half: {
            algorithm: "MD5",
            hash: FIRST_HASH_MD5
        },

        last_half: {
            algorithm: "SHA1",
            hash: LAST_HASH_SHA1
        },

        hint: "Split key into 2 parts of 3 characters each",

        example: "ABCDEF → ABC + DEF"

    });

});


// -------------------------
// Health endpoint
// -------------------------

app.get("/api/health", (req, res) => {

    res.json({
        status: "ok"
    });

});


// -------------------------
// Validation endpoint
// -------------------------

app.post("/api/validate", (req, res) => {

    const ip = req.ip;

    if (isRateLimited(ip)) {

        return res.status(429).json({
            success: false,
            message: "Too many attempts"
        });

    }

    const key = req.body.key;

    if (typeof key !== "string") {

        return res.status(400).json({
            success: false,
            message: "Invalid input"
        });

    }

    if (!/^[A-Z0-9]{6}$/.test(key)) {

        return res.json({
            success: false,
            message: "Invalid key format"
        });

    }

    // Split input
    const first = key.slice(0, 3);
    const last  = key.slice(3, 6);

    // Hash first part with MD5
    const firstHash = crypto
        .createHash("md5")
        .update(first)
        .digest("hex");

    // Hash last part with SHA1
    const lastHash = crypto
        .createHash("sha1")
        .update(last)
        .digest("hex");

    // Validate
    if (firstHash === FIRST_HASH_MD5 && lastHash === LAST_HASH_SHA1) {

        return res.json({
            success: true,
            flag: FLAG
        });

    }

    return res.json({
        success: false,
        message: "Invalid key"
    });

});


// -------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Dual Hash CTF server running on port", PORT);
});
