const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// In-memory storage (replace with database in production)
const children = [];
const growthRecords = [];
const attendanceRecords = [];
const vaccinationRecords = [];
const alerts = [];

// Child Registration
app.post('/api/children', (req, res) => {
    const child = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date()
    };
    children.push(child);
    res.status(201).json({ success: true, data: child });
});

app.get('/api/children', (req, res) => {
    res.json({ success: true, data: children });
});

app.get('/api/children/:id', (req, res) => {
    const child = children.find(c => c.id === req.params.id);
    if (!child) return res.status(404).json({ success: false, message: 'Child not found' });
    res.json({ success: true, data: child });
});

// Growth Monitoring
app.post('/api/growth', (req, res) => {
    const record = {
        id: Date.now().toString(),
        ...req.body,
        recordedAt: new Date()
    };
    growthRecords.push(record);
    
    // Simple risk detection
    const riskLevel = detectNutritionRisk(record);
    if (riskLevel !== 'normal') {
        alerts.push({
            id: Date.now().toString(),
            childId: record.childId,
            type: 'nutrition',
            level: riskLevel,
            message: `Nutrition risk detected: ${riskLevel}`,
            createdAt: new Date()
        });
    }
    
    res.status(201).json({ success: true, data: record, riskLevel });
});

app.get('/api/growth/:childId', (req, res) => {
    const records = growthRecords.filter(r => r.childId === req.params.childId);
    res.json({ success: true, data: records });
});

// Attendance Tracking
app.post('/api/attendance', (req, res) => {
    const record = {
        id: Date.now().toString(),
        ...req.body,
        markedAt: new Date()
    };
    attendanceRecords.push(record);
    res.status(201).json({ success: true, data: record });
});

app.get('/api/attendance/:childId', (req, res) => {
    const records = attendanceRecords.filter(r => r.childId === req.params.childId);
    res.json({ success: true, data: records });
});

// Vaccination Tracking
app.post('/api/vaccinations', (req, res) => {
    const record = {
        id: Date.now().toString(),
        ...req.body,
        recordedAt: new Date()
    };
    vaccinationRecords.push(record);
    res.status(201).json({ success: true, data: record });
});

app.get('/api/vaccinations/:childId', (req, res) => {
    const records = vaccinationRecords.filter(r => r.childId === req.params.childId);
    res.json({ success: true, data: records });
});

// Alerts
app.get('/api/alerts', (req, res) => {
    res.json({ success: true, data: alerts });
});

// Dashboard Stats
app.get('/api/stats', (req, res) => {
    const stats = {
        totalChildren: children.length,
        atRisk: alerts.filter(a => a.level === 'high').length,
        vaccinationDue: vaccinationRecords.filter(v => !v.completed).length,
        attendanceRate: calculateAttendanceRate()
    };
    res.json({ success: true, data: stats });
});

// Contact Form
app.post('/api/contact', (req, res) => {
    console.log('Contact form submission:', req.body);
    // In production, send email or save to database
    res.json({ success: true, message: 'Message received' });
});

// Helper Functions
function detectNutritionRisk(record) {
    // Simple BMI-based risk detection
    if (!record.weight || !record.height) return 'normal';
    
    const heightInMeters = record.height / 100;
    const bmi = record.weight / (heightInMeters * heightInMeters);
    
    if (bmi < 14) return 'high';
    if (bmi < 16) return 'moderate';
    return 'normal';
}

function calculateAttendanceRate() {
    if (attendanceRecords.length === 0) return 0;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    return Math.round((present / attendanceRecords.length) * 100);
}

app.listen(PORT, () => {
    console.log(`Nutrilytics Backend API running on http://localhost:${PORT}`);
    console.log(`Frontend will run on http://localhost:3000`);
});
