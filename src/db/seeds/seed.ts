import { Faker, en } from "@faker-js/faker";
import { UserRepository } from "../../repositories/user.repository";
import { ProjectRepository } from "../../repositories/project.repository";
import { TaskRepository } from "../../repositories/task.repository";
import { TimeLogRepository } from "../../repositories/timeLog.repository";
import { TaskTypeRepository } from "../../repositories/taskType.repository";
import { RoleEnum } from "../../enums/role.enum";
import { ProjectModeEnum } from "../../enums/projectMode.enum";
import { AppDataSource } from "../conf/appDataSource";

const faker = new Faker({ locale: [en] });

async function seed() {
  const userRepository = UserRepository;
  const projectRepository = ProjectRepository;
  const taskRepository = TaskRepository;
  const taskTypeRepository = TaskTypeRepository;
  const timeLogRepository = TimeLogRepository;

  // Create roles
  const roles = Object.values(RoleEnum);

  // Create users
  const usersData = [
    {
      firstName: "Shafiqul",
      lastName: "Islam",
      role: RoleEnum.ENGINEER,
      manager: "Sajjad Hossain",
    },
    {
      firstName: "Sayemul",
      lastName: "Haque",
      role: RoleEnum.ENGINEER,
      manager: "Sajjad Hossain",
    },
    {
      firstName: "Ashikuzzaman",
      lastName: "Kanon",
      role: RoleEnum.ENGINEER,
      manager: "Sajjad Hossain",
    },
    {
      firstName: "Simon",
      lastName: "Das",
      role: RoleEnum.ENGINEER,
      manager: "Sajjad Hossain",
    },
    {
      firstName: "Nazmul",
      lastName: "Hassan",
      role: RoleEnum.ENGINEER,
      manager: "Sajjad Hossain",
    },
    {
      firstName: "Ashraful",
      lastName: "Islam",
      role: RoleEnum.ENGINEER,
      manager: "Sajjad Hossain",
    },
    {
      firstName: "Jisan",
      lastName: "Shaikh",
      role: RoleEnum.ENGINEER,
      manager: "Ashik Ahmed",
    },
    {
      firstName: "Pranta",
      lastName: "Saha",
      role: RoleEnum.ENGINEER,
      manager: "Ashik Ahmed",
    },
    {
      firstName: "Zubayet",
      lastName: "Zaman",
      role: RoleEnum.LEAD,
      manager: "Tazbinur Sharif",
    },
    {
      firstName: "Redoanur",
      lastName: "Rahman",
      role: RoleEnum.LEAD,
      manager: "Tazbinur Sharif",
    },
    {
      firstName: "Ahmad",
      lastName: "Sameen",
      role: RoleEnum.LEAD,
      manager: "Tazbinur Sharif",
    },
    {
      firstName: "Sajjad",
      lastName: "Hossain",
      role: RoleEnum.LEAD,
      manager: "Tazbinur Sharif",
    },
    {
      firstName: "Ashik",
      lastName: "Ahmed",
      role: RoleEnum.LEAD,
      manager: "Tazbinur Sharif",
    },
    {
      firstName: "Riasat",
      lastName: "Ali",
      role: RoleEnum.LEAD,
      manager: "Tazbinur Sharif",
    },
    {
      firstName: "Nasrul",
      lastName: "Karim",
      role: RoleEnum.LEAD,
      manager: "Touhidul Islam",
    },
    {
      firstName: "Christina",
      lastName: "Halder",
      role: RoleEnum.LEAD,
      manager: "Touhidul Islam",
    },
    {
      firstName: "Shams",
      lastName: "Shad",
      role: RoleEnum.LEAD,
      manager: "Muhammad Sakib",
    },
    {
      firstName: "Tazbinur",
      lastName: "Sharif",
      role: RoleEnum.MANAGER,
      manager: "Super Admin",
    },
    {
      firstName: "Ananta",
      lastName: "Ghosh",
      role: RoleEnum.MANAGER,
      manager: "Super Admin",
    },
    {
      firstName: "Muhammad",
      lastName: "Sakib",
      role: RoleEnum.MANAGER,
      manager: "Super Admin",
    },
    {
      firstName: "Touhidul",
      lastName: "Islam",
      role: RoleEnum.MANAGER,
      manager: "Super Admin",
    },
    { firstName: "Super", lastName: "Admin", role: RoleEnum.SYSTEM_ADMIN },
  ];

  const users = usersData.map((userData) => ({
    email: `${userData.firstName.toLowerCase()}@enosisbd.com`,
    password: "$2b$10$AS4fAJii9fjR8762dgDfF.rKLUmXph7LGezE3XZp66dVFPt8UXRTW",
    ...userData,
  }));

  const savedUsers = await userRepository.save(users);

  // Update managedBy based on manager names
  const userMap = new Map(
    savedUsers.map((user) => [`${user.firstName} ${user.lastName}`, user])
  );

  for (const userData of usersData) {
    // @ts-ignore
    const user = userMap.get(userData.manager);
    if (user) {
      const managedUser = savedUsers.find(
        (u) =>
          u.firstName === userData.firstName && u.lastName === userData.lastName
      );
      if (managedUser) {
        managedUser.managedBy = user;
      }
    }
  }

  await userRepository.save(savedUsers);

  // Create projects
  const projectNames = [
    "Trello Project",
    "Jira Project",
    "Asana Project",
    "Zoom Project",
    "GitHub Project",
  ];
  const projects = projectNames.map((projectName) => ({
    name: projectName,
    startedAt: faker.date.past(),
    endedAt: faker.date.future(),
    mode: ProjectModeEnum.PROJECT,
    devManager: savedUsers.find(
      (user) => user.firstName === "Zubayet" && user.lastName === "Zaman"
    ),
    projectManager: savedUsers.find(
      (user) => user.firstName === "Tazbinur" && user.lastName === "Sharif"
    ),
    devLead: savedUsers.find(
      (user) => user.firstName === "Redoanur" && user.lastName === "Rahman"
    ),
    techLead: savedUsers.find(
      (user) => user.firstName === "Ahmad" && user.lastName === "Sameen"
    ),
    projectLead: savedUsers.find(
      (user) => user.firstName === "Nasrul" && user.lastName === "Karim"
    ),
    updatedBy: savedUsers.find(
      (user) => user.firstName === "Super" && user.lastName === "Admin"
    ),
  }));

  const savedProjects = await projectRepository.save(projects);

  // Create task types
  const taskTypeNames = [
    "Issue Analysis",
    "Testing",
    "Bugfix",
    "Communication",
  ];
  const taskTypes = taskTypeNames.map((taskTypeName) => ({
    name: taskTypeName,
    updatedBy: savedUsers.find(
      (user) => user.firstName === "Super" && user.lastName === "Admin"
    ),
  }));

  const savedTaskTypes = await taskTypeRepository.save(taskTypes);

  // Create tasks
  const taskNames = [
    "Fix Bug in Project Jira",
    "Implement Real-time Communication in Zoom",
    "Feature Development in GitHub",
  ];
  const tasks = taskNames.map((taskName, index) => ({
    name: taskName,
    project: savedProjects[index % savedProjects.length],
    updatedBy: savedUsers.find(
      (user) => user.firstName === "Super" && user.lastName === "Admin"
    ),
  }));

  const savedTasks = await taskRepository.save(tasks);

  // Create time logs
  const timeLogs = savedTasks.map((task) => ({
    task,
    taskType: savedTaskTypes[Math.floor(Math.random() * savedTaskTypes.length)],
    description: faker.lorem.sentence(),
    date: faker.date.past(),
    timeDurationInHours: faker.number.int({ min: 1, max: 8 }),
    owner: savedUsers.find(
      (user) => user.firstName === "Super" && user.lastName === "Admin"
    ),
    updatedBy: savedUsers.find(
      (user) => user.firstName === "Super" && user.lastName === "Admin"
    ),
  }));

  await timeLogRepository.save(timeLogs);
}

AppDataSource.initialize()
  .then(async () => {
    seed();
  })
  .catch((error: any) => {
    console.error("Database connection error:", error);
  });
