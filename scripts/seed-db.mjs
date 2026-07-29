import { initializeApp } from 'firebase/app';
import { getFirestore, doc, collection, writeBatch, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

// Завантажуємо .env
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const MAIN_USER_ID = 'FOjXOhNg8jMCmRira5mPyIp4HIz1';
const MEMBER_1_ID = 'GsOrvl10A7P4sCmZDsqaN3ZDQrr2';
const MEMBER_2_ID = 'hglEo2Fg1UVHa7YubvxTxUzapW92';
const ALL_MEMBERS = [MAIN_USER_ID, MEMBER_1_ID, MEMBER_2_ID];

const projectsData = [
    {
        id: 'proj-ecommerce-ai',
        title: 'E-Commerce Platform with AI Assistant',
        description: 'Next-gen online shopping platform featuring real-time AI product recommendations, Kanban management, and full-stack analytics.',
        assignedMembers: ALL_MEMBERS,
        status: 'in_progress',
        startDate: Timestamp.fromDate(new Date('2026-06-01')),
        endDate: Timestamp.fromDate(new Date('2026-09-01')),
    },
    {
        id: 'proj-mobile-app',
        title: 'Mobile Companion App',
        description: 'Cross-platform mobile client for push-notifications, quick task status updates, and offline sync.',
        assignedMembers: [MAIN_USER_ID, MEMBER_1_ID],
        status: 'planned',
        startDate: Timestamp.fromDate(new Date('2026-08-10')),
        endDate: Timestamp.fromDate(new Date('2026-11-30')),
    },
];

const tasksData = [
    {
        projectId: 'proj-ecommerce-ai',
        creatorId: MAIN_USER_ID,
        title: 'Implement Dark Mode Theme',
        description: 'Add Tailwind CSS dark theme support across all dashboard pages with system theme auto-detection.',
        assignedMembers: [MEMBER_1_ID],
        status: 'todo',
        priority: 'medium',
        type: 'UIFix',
        category: 'Frontend',
        startDate: Timestamp.fromDate(new Date('2026-08-01')),
        endDate: Timestamp.fromDate(new Date('2026-08-05')),
        createdAt: Timestamp.fromDate(new Date('2026-07-20')),
        updatedAt: Timestamp.fromDate(new Date('2026-07-20')),
    },
    {
        projectId: 'proj-ecommerce-ai',
        creatorId: MAIN_USER_ID,
        title: 'Integrate Stripe Payment Gateway',
        description: 'Set up checkout session Webhooks and support Apple Pay / Credit Card billing flow.',
        assignedMembers: [MEMBER_2_ID],
        status: 'todo',
        priority: 'high',
        type: 'Feature',
        category: 'Backend',
        startDate: Timestamp.fromDate(new Date('2026-08-03')),
        endDate: Timestamp.fromDate(new Date('2026-08-12')),
        createdAt: Timestamp.fromDate(new Date('2026-07-22')),
        updatedAt: Timestamp.fromDate(new Date('2026-07-22')),
    },
    {
        projectId: 'proj-ecommerce-ai',
        creatorId: MAIN_USER_ID,
        title: 'Write Unit Tests for Auth Middleware',
        description: 'Cover token validation, error handling, and session expiration using Vitest.',
        assignedMembers: [MAIN_USER_ID, MEMBER_2_ID],
        status: 'todo',
        priority: 'low',
        type: 'TechDebt',
        category: 'QA_Automation',
        startDate: Timestamp.fromDate(new Date('2026-08-05')),
        endDate: Timestamp.fromDate(new Date('2026-08-08')),
        createdAt: Timestamp.fromDate(new Date('2026-07-25')),
        updatedAt: Timestamp.fromDate(new Date('2026-07-25')),
    },
    // --- IN PROGRESS ---
    {
        projectId: 'proj-ecommerce-ai',
        creatorId: MAIN_USER_ID,
        title: 'Kanban Board Mobile Responsiveness',
        description: 'Remove heavy borders on mobile screens, adjust paddings, and implement smooth swipe gestures.',
        assignedMembers: [MAIN_USER_ID, MEMBER_1_ID],
        status: 'in_progress',
        priority: 'high',
        type: 'Improvement',
        category: 'Frontend',
        startDate: Timestamp.fromDate(new Date('2026-07-26')),
        endDate: Timestamp.fromDate(new Date('2026-07-30')),
        createdAt: Timestamp.fromDate(new Date('2026-07-15')),
        updatedAt: Timestamp.fromDate(new Date('2026-07-27')),
    },
    {
        projectId: 'proj-ecommerce-ai',
        creatorId: MEMBER_2_ID,
        title: 'OpenAI LLM Assistant API Route',
        description: 'Build backend proxy endpoint for OpenAI API with prompt engineering for project context generation.',
        assignedMembers: [MAIN_USER_ID, MEMBER_2_ID],
        status: 'in_progress',
        priority: 'high',
        type: 'Feature',
        category: 'Fullstack',
        startDate: Timestamp.fromDate(new Date('2026-07-24')),
        endDate: Timestamp.fromDate(new Date('2026-07-31')),
        createdAt: Timestamp.fromDate(new Date('2026-07-18')),
        updatedAt: Timestamp.fromDate(new Date('2026-07-26')),
    },
    {
        projectId: 'proj-ecommerce-ai',
        creatorId: MAIN_USER_ID,
        title: 'User Profile & Saved Members Sync',
        description: 'Persist quick-select saved team members in Zustand state & LocalStorage.',
        assignedMembers: [MEMBER_1_ID],
        status: 'in_progress',
        priority: 'medium',
        type: 'Feature',
        category: 'Frontend',
        startDate: Timestamp.fromDate(new Date('2026-07-25')),
        endDate: Timestamp.fromDate(new Date('2026-07-29')),
        createdAt: Timestamp.fromDate(new Date('2026-07-21')),
        updatedAt: Timestamp.fromDate(new Date('2026-07-28')),
    },
    // --- DONE ---
    {
        projectId: 'proj-ecommerce-ai',
        creatorId: MAIN_USER_ID,
        title: 'Setup Firebase Auth & Firestore DB',
        description: 'Configure security rules, environment variables, and initialization pipeline.',
        assignedMembers: [MAIN_USER_ID],
        status: 'done',
        priority: 'high',
        type: 'Management',
        category: 'DevOps',
        startDate: Timestamp.fromDate(new Date('2026-06-01')),
        endDate: Timestamp.fromDate(new Date('2026-06-05')),
        createdAt: Timestamp.fromDate(new Date('2026-06-01')),
        updatedAt: Timestamp.fromDate(new Date('2026-06-05')),
    },
    {
        projectId: 'proj-ecommerce-ai',
        creatorId: MAIN_USER_ID,
        title: 'Toast Notification Manager Component',
        description: 'Custom React toast system with side animations, queue management, and mobile size adaptations.',
        assignedMembers: [MAIN_USER_ID, MEMBER_1_ID],
        status: 'done',
        priority: 'medium',
        type: 'Feature',
        category: 'Frontend',
        startDate: Timestamp.fromDate(new Date('2026-06-10')),
        endDate: Timestamp.fromDate(new Date('2026-06-15')),
        createdAt: Timestamp.fromDate(new Date('2026-06-08')),
        updatedAt: Timestamp.fromDate(new Date('2026-06-15')),
    },
    {
        projectId: 'proj-ecommerce-ai',
        creatorId: MEMBER_2_ID,
        title: 'Fix CORS Issue on Auth Redirect',
        description: 'Update Firebase auth allowed domain origin rules for local and preview deployments.',
        assignedMembers: [MEMBER_2_ID],
        status: 'done',
        priority: 'high',
        type: 'QuickFix',
        category: 'DevOps',
        startDate: Timestamp.fromDate(new Date('2026-06-16')),
        endDate: Timestamp.fromDate(new Date('2026-06-16')),
        createdAt: Timestamp.fromDate(new Date('2026-06-16')),
        updatedAt: Timestamp.fromDate(new Date('2026-06-16')),
    }
];

async function runSeed() {
    console.log('🚀 Authenticating...');

    // Авторизуємося перед записом (вкажи пароль від demo.user@example.com)
    await signInWithEmailAndPassword(auth, 'demo.user@example.com', 'password123');
    console.log('✅ Authenticated successfully!');

    console.log('🚀 Starting Database Seeding...');
    const batch = writeBatch(db);

    for (const proj of projectsData) {
        const projRef = doc(db, 'projects', proj.id);
        batch.set(projRef, proj, { merge: true });
    }

    for (const task of tasksData) {
        const taskRef = doc(collection(db, 'tasks'));
        batch.set(taskRef, task);
    }

    await batch.commit();
    console.log('🎉 Database Seeding Completed Successfully!');
    process.exit(0);
}

runSeed().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});