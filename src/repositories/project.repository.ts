import {
  ICreateProjectRequestBody,
  IUpdateProjectRequestBody,
} from "./../types/project.type";
import { JwtPayload } from "jsonwebtoken";
import { AppDataSource } from "../db/conf/appDataSource";
import { IsNull, Not } from "typeorm";
import { ProjectEntity } from "../db/entities/project.entity";

export const ProjectRepository = AppDataSource.getRepository(
  ProjectEntity
).extend({
  relations: [
    "updatedBy",
    "devManager",
    "projectManager",
    "devLead",
    "techLead",
    "projectLead",
  ],

  async getProjects() {
    try {
      const projects = await this.find({
        relations: this.relations,
      });
      return projects;
    } catch (error) {
      throw error;
    }
  },

  async findProjectById(id: string) {
    try {
      const project = await this.findOne({
        where: { id },
        relations: this.relations,
      });
      return project;
    } catch (error) {
      throw error;
    }
  },

  async findDeletedProjectById(id: string) {
    try {
      const project = await this.findOne({
        withDeleted: true,
        where: {
          id,
          deletedAt: Not(IsNull()),
        },
        relations: this.relations,
      });

      return project;
    } catch (error) {
      throw error;
    }
  },

  async findProjectByName(name: string) {
    try {
      const project = await this.findOneBy({ name });
      return project;
    } catch (error) {
      throw error;
    }
  },

  async findProjectByNameWithDeleted(name: string) {
    try {
      const project = await this.createQueryBuilder("project")
        .where("project.name = :name", { name })
        .withDeleted()
        .getOne();
      return project;
    } catch (error) {
      throw error;
    }
  },

  buildProjectOptions(
    project: ICreateProjectRequestBody | IUpdateProjectRequestBody
  ) {
    return {
      name: project?.name,
      startedAt: project?.startedAt || undefined,
      endedAt: project?.endedAt || undefined,
      mode: project?.mode || undefined,
      devManager: project?.devManager
        ? {
            id: project?.devManager,
          }
        : undefined,
      projectManager: project?.projectManager
        ? {
            id: project?.projectManager,
          }
        : undefined,
      devLead: project?.devLead
        ? {
            id: project?.devLead,
          }
        : undefined,
      techLead: project?.techLead
        ? {
            id: project?.techLead,
          }
        : undefined,
      projectLead: project?.projectLead
        ? {
            id: project?.projectLead,
          }
        : undefined,
      updatedBy: project?.updatedBy
        ? {
            id: project?.updatedBy,
          }
        : undefined,
    };
  },

  async createProject(project: ICreateProjectRequestBody) {
    try {
      const projectOptions = this.buildProjectOptions(project);
      const newProject = await this.create(projectOptions);

      await this.save(newProject);

      const justSavedProject = await this.findProjectById(newProject.id);

      return justSavedProject;
    } catch (error) {
      throw error;
    }
  },

  async updateProjectById(id: string, project: IUpdateProjectRequestBody) {
    try {
      const projectOptions = this.buildProjectOptions(project);
      const existingProject = await this.findProjectById(id);

      if (!existingProject) {
        return null;
      }

      const result = await this.update({ id }, projectOptions);

      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteProjectById(id: string, user: JwtPayload) {
    try {
      const project = await this.findProjectById(id);

      if (!project) {
        return null;
      }

      const { iat, exp, ...userInfo } = user;

      project.deletedAt = new Date();
      // @ts-ignore
      project.updatedBy = userInfo;

      this.save(project);

      return project;
    } catch (error) {
      throw error;
    }
  },

  async restoreProjectById(id: string, user: JwtPayload) {
    try {
      const project = await this.findDeletedProjectById(id);

      console.log(project);

      if (!project) {
        return null;
      }

      const { iat, exp, ...userInfo } = user;

      project.deletedAt = null;
      // @ts-ignore
      project.updatedBy = userInfo;

      this.save(project);

      return project;
    } catch (error) {
      throw error;
    }
  },
});
