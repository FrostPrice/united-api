const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const salt = bcrypt.genSaltSync(10);
  const password1 = await bcrypt.hashSync("admin", salt);
  const password2 = await bcrypt.hashSync("123", salt);

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      id: "1",
      email: "admin@email.com",
      name: "User One",
      password: password1,
      role: "admin",
      profile_img: "https://example.com/profile1.jpg",
      telephone1: "1234567890",
      telephone2: "0987654321",
      status: "active",
      course: "Computer Science",
      currentPeriod: 2,
      totalPeriods: 8,
      Notification: {
        create: [
          {
            title: "Welcome!",
            description: "Welcome to the platform.",
            type: "info",
            status: "new",
          },
          {
            title: "New Subject",
            description: "New subject available.",
            type: "info",
            status: "new",
          },
          {
            title: "New Event",
            description: "New event available.",
            type: "info",
            status: "new",
          },
          {
            title: "New Assessment",
            description: "New assessment available.",
            type: "info",
            status: "new",
          },
          {
            title: "New Grade",
            description: "New grade available.",
            type: "info",
            status: "new",
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "2",
      email: "user2@example.com",
      name: "User Two",
      password: password2,
      role: "professor",
      profile_img: "https://example.com/profile2.jpg",
      telephone1: "2345678901",
      status: "active",
      course: "Mathematics",
      currentPeriod: 1,
      totalPeriods: 6,
    },
  });

  // Create Professors
  const professor1 = await prisma.professor.create({
    data: {
      name: "Professor One",
      email: "professor1@example.com",
    },
  });

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      name: "Introduction to Programming",
      professorId: professor1.id,
    },
  });

  // Create Subjects
  const subject1 = await prisma.subject.create({
    data: {
      name: "JavaScript Basics",
      courseId: course1.id,
      professorId: professor1.id,
      period: "1st Period",
      yearSemester: "2024-1",
      status: "active",
      lastNotification: new Date(),
    },
  });

  // Create Events
  await prisma.event.create({
    data: {
      title: "Orientation",
      description: "Orientation for new students.",
      date_begin: new Date(),
      date_end: new Date(),
      userId: user1.id,
    },
  });

  // Create Enrollments
  await prisma.enrollment.create({
    data: {
      userId: user1.id,
      subjectId: subject1.id,
      status: "enrolled",
      absences: 0,
      maxAbsences: 3,
    },
  });

  // Create Assessments
  const assessment1 = await prisma.assessment.create({
    data: {
      subjectId: subject1.id,
      name: "Midterm Exam",
      dueDate: new Date(),
      status: "pending",
    },
  });

  // Create Contents
  await prisma.content.create({
    data: {
      subjectId: subject1.id,
      name: "Introduction to JavaScript",
    },
  });
  await prisma.content.create({
    data: {
      subjectId: subject1.id,
      name: "Variables",
    },
  });
  await prisma.content.create({
    data: {
      subjectId: subject1.id,
      name: "Operators",
    },
  });

  // Create Grades
  await prisma.grade.create({
    data: {
      assessmentId: assessment1.id,
      enrollmentId: 1, // Assuming enrollment ID is 1
      value: 85,
      weight: 0.5,
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
