export const generateSampleData = () => {
  const centres = ['Anganwadi Centre 1', 'Anganwadi Centre 2', 'Anganwadi Centre 3'];
  
  const childNames = [
    { name: 'Aarav Kumar', parent: 'Rajesh Kumar', phone: '+919876543210' },
    { name: 'Diya Sharma', parent: 'Priya Sharma', phone: '+919876543211' },
    { name: 'Arjun Patel', parent: 'Amit Patel', phone: '+919876543212' },
    { name: 'Ananya Singh', parent: 'Sunita Singh', phone: '+919876543213' },
    { name: 'Vihaan Reddy', parent: 'Lakshmi Reddy', phone: '+919876543214' },
    { name: 'Saanvi Gupta', parent: 'Neha Gupta', phone: '+919876543215' },
    { name: 'Aditya Verma', parent: 'Ramesh Verma', phone: '+919876543216' },
    { name: 'Isha Nair', parent: 'Meera Nair', phone: '+919876543217' },
    { name: 'Reyansh Joshi', parent: 'Suresh Joshi', phone: '+919876543218' },
    { name: 'Myra Desai', parent: 'Kavita Desai', phone: '+919876543219' },
    { name: 'Kabir Mehta', parent: 'Vijay Mehta', phone: '+919876543220' },
    { name: 'Aanya Iyer', parent: 'Radha Iyer', phone: '+919876543221' },
    { name: 'Vivaan Rao', parent: 'Sanjay Rao', phone: '+919876543222' },
    { name: 'Kiara Pillai', parent: 'Deepa Pillai', phone: '+919876543223' },
    { name: 'Ayaan Khan', parent: 'Fatima Khan', phone: '+919876543224' },
    { name: 'Navya Menon', parent: 'Suma Menon', phone: '+919876543225' },
    { name: 'Dhruv Bhat', parent: 'Anand Bhat', phone: '+919876543226' },
    { name: 'Pari Shetty', parent: 'Lata Shetty', phone: '+919876543227' },
    { name: 'Atharv Kulkarni', parent: 'Prakash Kulkarni', phone: '+919876543228' },
    { name: 'Riya Naik', parent: 'Shobha Naik', phone: '+919876543229' }
  ];

  const children = childNames.map((child, index) => ({
    id: `child_${index + 1}`,
    name: child.name,
    dob: new Date(2020 + Math.floor(index / 5), (index * 2) % 12, (index * 3) % 28 + 1).toISOString(),
    age: 3 + Math.floor(index / 5),
    gender: index % 2 === 0 ? 'Male' : 'Female',
    parentName: child.parent,
    parentPhone: child.phone,
    address: `Village ${Math.floor(index / 3) + 1}, District Area`,
    centre: centres[index % 3],
    aadhaar: '',
    notes: '',
    createdAt: new Date(2024, 0, index + 1).toISOString()
  }));

  const growthRecords = [];
  children.forEach(child => {
    for (let i = 0; i < 6; i++) {
      const baseWeight = 10 + child.age * 2;
      const baseHeight = 70 + child.age * 10;
      growthRecords.push({
        id: `growth_${child.id}_${i}`,
        childId: child.id,
        weight: baseWeight + i * 0.5 + (Math.random() * 0.5 - 0.25),
        height: baseHeight + i * 2 + (Math.random() * 2 - 1),
        muac: 12 + i * 0.3 + (Math.random() * 0.5),
        recordedAt: new Date(2024, i, 15).toISOString(),
        notes: ''
      });
    }
  });

  const attendanceRecords = [];
  children.forEach(child => {
    for (let i = 0; i < 30; i++) {
      attendanceRecords.push({
        id: `attendance_${child.id}_${i}`,
        childId: child.id,
        date: new Date(2024, 5, i + 1).toISOString(),
        status: Math.random() > 0.15 ? 'present' : 'absent',
        markedAt: new Date(2024, 5, i + 1, 9, 0).toISOString()
      });
    }
  });

  const vaccines = [
    { name: 'BCG', dueAge: 0 },
    { name: 'OPV-1', dueAge: 6 },
    { name: 'DPT-1', dueAge: 6 },
    { name: 'OPV-2', dueAge: 10 },
    { name: 'DPT-2', dueAge: 10 },
    { name: 'OPV-3', dueAge: 14 },
    { name: 'DPT-3', dueAge: 14 },
    { name: 'Measles', dueAge: 9 }
  ];

  const vaccinationRecords = [];
  children.forEach(child => {
    vaccines.forEach((vaccine, index) => {
      const ageInMonths = child.age * 12;
      const completed = ageInMonths > vaccine.dueAge + 2;
      vaccinationRecords.push({
        id: `vaccine_${child.id}_${index}`,
        childId: child.id,
        vaccineName: vaccine.name,
        dueDate: new Date(new Date(child.dob).getTime() + vaccine.dueAge * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: completed ? 'completed' : ageInMonths >= vaccine.dueAge ? 'due' : 'upcoming',
        completedDate: completed ? new Date(new Date(child.dob).getTime() + (vaccine.dueAge + 1) * 30 * 24 * 60 * 60 * 1000).toISOString() : null
      });
    });
  });

  const alerts = [
    {
      id: 'alert_1',
      childId: 'child_3',
      type: 'growth',
      severity: 'high',
      message: 'Weight stagnant over last 3 months - possible nutrition risk',
      reason: 'Growth trend indicates possible nutrition risk',
      action: 'Schedule nutrition assessment and counseling',
      createdAt: new Date(2024, 5, 20).toISOString(),
      resolved: false
    },
    {
      id: 'alert_2',
      childId: 'child_7',
      type: 'vaccination',
      severity: 'medium',
      message: 'DPT-3 vaccination overdue by 14 days',
      reason: 'Vaccination overdue',
      action: 'Contact parent immediately for vaccination',
      createdAt: new Date(2024, 5, 18).toISOString(),
      resolved: false
    },
    {
      id: 'alert_3',
      childId: 'child_12',
      type: 'attendance',
      severity: 'medium',
      message: 'Absent for 5 consecutive days',
      reason: 'Irregular attendance pattern detected',
      action: 'Home visit required to check child wellbeing',
      createdAt: new Date(2024, 5, 19).toISOString(),
      resolved: false
    }
  ];

  return {
    children,
    growthRecords,
    attendanceRecords,
    vaccinationRecords,
    alerts
  };
};
