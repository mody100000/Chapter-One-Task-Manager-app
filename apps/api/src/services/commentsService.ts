import { prisma } from "../lib/prisma.js";

export const createComment = async (taskId: string, message: string, createdById: string) => {
  return prisma.comment.create({
    data: {
      message,
      task: { connect: { id: taskId } },
      createdBy: { connect: { id: createdById } },
    },
  });
};

export const getTaskTimeline = async (taskId: string) => {
  const [comments, activityLogs] = await Promise.all([
    prisma.comment.findMany({
      where: { taskId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.taskActivityLog.findMany({
      where: { taskId },
      include: {
        performedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  const commentItems = comments.map((comment) => ({
    type: "comment" as const,
    id: comment.id,
    taskId: comment.taskId,
    datetime: comment.createdAt,
    message: comment.message,
    createdBy: comment.createdBy,
  }));

  const activityItems = activityLogs.map((log) => ({
    type: "activity" as const,
    id: log.id,
    taskId: log.taskId,
    datetime: log.timestamp,
    action: log.action,
    performedBy: log.performedBy,
  }));

  return [...commentItems, ...activityItems].sort(
    (a, b) => b.datetime.getTime() - a.datetime.getTime(),
  );
};
