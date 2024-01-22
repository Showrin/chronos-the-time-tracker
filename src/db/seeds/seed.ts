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

  // Create super admin
  const superAdmin = userRepository.create({
    email: "superadmin@example.com",
    firstName: "Super",
    lastName: "Admin",
    password: "$2b$10$AS4fAJii9fjR8762dgDfF.rKLUmXph7LGezE3XZp66dVFPt8UXRTW",
    role: RoleEnum.SYSTEM_ADMIN,
  });
  await userRepository.save(superAdmin);

  // Create managers
  const managers = [];
  for (let i = 0; i < 5; i++) {
    const manager = userRepository.create({
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: "$2b$10$AS4fAJii9fjR8762dgDfF.rKLUmXph7LGezE3XZp66dVFPt8UXRTW",
      role: RoleEnum.MANAGER,
      managedBy: superAdmin,
    });

    managers.push(manager);
  }
  await userRepository.save(managers);

  // Create leads
  const leads = [];
  for (let i = 0; i < 10; i++) {
    const lead = userRepository.create({
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: "$2b$10$AS4fAJii9fjR8762dgDfF.rKLUmXph7LGezE3XZp66dVFPt8UXRTW",
      role: RoleEnum.LEAD,
      managedBy: managers[i % 5],
    });

    leads.push(lead);
  }
  await userRepository.save(leads);

  // Create engineers
  const engineers = [];
  for (let i = 0; i < 25; i++) {
    const engineer = userRepository.create({
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: "$2b$10$AS4fAJii9fjR8762dgDfF.rKLUmXph7LGezE3XZp66dVFPt8UXRTW",
      role: RoleEnum.ENGINEER,
      managedBy: leads[i % 10],
    });

    engineers.push(engineer);
  }
  await userRepository.save(engineers);

  // Create projects
  const projectNames = ["Trello", "Jira", "Asana", "Zoom", "Meet", "GitHub"];
  const projects = [];
  for (let i = 0; i < projectNames.length; i++) {
    const project = projectRepository.create({
      name: projectNames[i],
      startedAt: new Date(),
      endedAt: new Date(),
      mode: ProjectModeEnum.PROJECT,
      devManager: managers[i % 5],
      projectManager: managers[(i + 1) % 5],
      devLead: leads[i % 10],
      techLead: leads[(i + 1) % 10],
      projectLead: leads[(i + 2) % 10],
      updatedBy: superAdmin,
    });

    projects.push(project);
  }
  await projectRepository.save(projects);

  // Create tasks
  const taskNames = new Set<string>();
  const tasks = [];
  for (let i = 0; i < 30; i++) {
    const baseTaskName = faker.lorem.words(3);
    let taskName = baseTaskName;
    let counter = 1;

    while (taskNames.has(taskName)) {
      taskName = `${baseTaskName} ${counter}`;
      counter++;
    }

    taskNames.add(taskName);

    const task = taskRepository.create({
      name: taskName,
      project: projects[i % projects.length],
      updatedBy: superAdmin,
    });

    tasks.push(task);
  }
  await taskRepository.save(tasks);

  // Create task types
  const taskTypeNames = [
    "Issue Analysis",
    "Testing",
    "Bugfix",
    "Communication",
  ];
  const taskTypes = [];
  for (let i = 0; i < taskTypeNames.length; i++) {
    const taskType = taskTypeRepository.create({
      name: taskTypeNames[i],
      updatedBy: superAdmin,
    });

    taskTypes.push(taskType);
  }
  await taskTypeRepository.save(taskTypes);

  // Create time logs
  const timeLogs = [];
  for (let i = 0; i < 20; i++) {
    const taskType = taskTypes[i % taskTypes.length];
    const timeLog = timeLogRepository.create({
      task: tasks[i % 30],
      taskType: taskType,
      description: `Work Log for ${tasks[i % 30].name}`,
      date: new Date(),
      timeDurationInHours: i + 1,
      owner: engineers[i % 25],
      updatedBy: superAdmin,
    });

    timeLogs.push(timeLog);
  }
  await timeLogRepository.save(timeLogs);
}

AppDataSource.initialize()
  .then(async () => {
    seed();
  })
  .catch((error: any) => {
    console.error("Database connection error:", error);
  });
