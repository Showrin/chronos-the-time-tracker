import { Request } from "express";
import { IProjectFilter } from "../types/project.type";
import { ProjectModeEnum } from "../enums/projectMode.enum";
import { Between, ILike } from "typeorm";

export const getProjectFilter = (req: Request) => {
  const name = req.query?.name as string;
  const startedAtRangeStart = req.query?.startedAtRangeStart as string;
  const startedAtRangeEnd = req.query?.startedAtRangeEnd as string;
  const endedAtRangeStart = req.query?.endedAtRangeStart as string;
  const endedAtRangeEnd = req.query?.endedAtRangeEnd as string;
  const mode = req.query?.mode as ProjectModeEnum;
  const devManager = req.query?.devManager as string;
  const projectManager = req.query?.projectManager as string;
  const devLead = req.query?.devLead as string;
  const techLead = req.query?.techLead as string;
  const projectLead = req.query?.projectLead as string;
  const projectFilter: IProjectFilter = {};

  if (!!name) {
    projectFilter.name = ILike(`%${name}%`);
  }

  if (!!startedAtRangeStart && !!startedAtRangeEnd) {
    projectFilter.startedAt = Between(
      new Date(startedAtRangeStart),
      new Date(startedAtRangeEnd)
    );
  }

  if (!!endedAtRangeStart && !!endedAtRangeEnd) {
    projectFilter.endedAt = Between(
      new Date(endedAtRangeStart),
      new Date(endedAtRangeEnd)
    );
  }

  if (!!mode) {
    projectFilter.mode = mode;
  }

  if (!!devManager) {
    projectFilter.devManager = { id: devManager };
  }

  if (!!projectManager) {
    projectFilter.projectManager = { id: projectManager };
  }

  if (!!devLead) {
    projectFilter.devLead = { id: devLead };
  }

  if (!!techLead) {
    projectFilter.techLead = { id: techLead };
  }

  if (!!projectLead) {
    projectFilter.projectLead = { id: projectLead };
  }

  return projectFilter;
};
