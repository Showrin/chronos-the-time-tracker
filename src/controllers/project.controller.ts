import { Request, Response } from "express";
import errorMessage from "../messages/error.message";
import {
  ICreateProjectRequestBody,
  IUpdateProjectRequestBody,
} from "../types/project.type";
import { ProjectRepository } from "../repositories/project.repository";
import { JwtPayload } from "jsonwebtoken";
import { UserEntity } from "../db/entities/user.entity";
import { getPaginationConfig } from "../services/paginate.service";

export const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectInfo: ICreateProjectRequestBody = req.body;
  // @ts-ignore
  const user: UserEntity = req?.user;

  if (!projectInfo.name) {
    return res
      .status(400)
      .json({ message: "Please, provide name for the project." });
  }

  try {
    const existingProject =
      await ProjectRepository.findProjectByNameWithDeleted(projectInfo.name);

    if (!!existingProject) {
      if (!!existingProject.deletedAt) {
        return res.status(400).json({
          message: `A project named "${existingProject.name}" was deleted before. Do you want to restore it?`,
          existingProject,
        });
      }

      return res.status(400).json({
        message: "A project with the provided name already exists.",
      });
    }

    const newProject = await ProjectRepository.createProject({
      ...projectInfo,
      updatedBy: user.id,
    });

    return res.status(201).json({
      message: "Project created successfully.",
      project: newProject,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const getProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { skip, take } = getPaginationConfig(req);
    const [projects, totalCount] = await ProjectRepository.getProjects({
      skip,
      take,
    });

    return res.status(200).json({
      message: "Projects fetched successfully.",
      totalCount,
      projects,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const findProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const projectId = req.params?.projectId;
    const project = await ProjectRepository.findProjectById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("Project") });
    }

    return res
      .status(200)
      .json({ message: "Project fetched successfully.", project });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const updateProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const projectId = req.params?.projectId;
    // @ts-ignore
    const user: UserEntity = req?.user;
    const projectInfo: IUpdateProjectRequestBody = req.body;

    if (!!projectInfo?.name) {
      const existingProject = await ProjectRepository.findProjectByName(
        projectInfo.name
      );

      if (!!existingProject) {
        return res.status(400).json({
          message: "A project with the provided name already exists.",
        });
      }
    }

    const result = await ProjectRepository.updateProjectById(projectId, {
      ...projectInfo,
      updatedBy: user.id,
    });

    if (!result || result.affected === 0) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("Project") });
    }

    return res.status(200).json({ message: "Project updated successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const deleteProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const projectId = req.params?.projectId;
    // @ts-ignore
    const user: JwtPayload = req?.user;

    const project = await ProjectRepository.deleteProjectById(projectId, user);

    if (!project) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("Project") });
    }

    return res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const restoreProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const projectId = req.params?.projectId;
    // @ts-ignore
    const user: JwtPayload = req?.user;

    const project = await ProjectRepository.restoreProjectById(projectId, user);

    if (!project) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("Project") });
    }

    return res
      .status(200)
      .json({ message: "Project reactivated successfully.", project });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};
