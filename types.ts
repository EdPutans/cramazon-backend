import { Prisma, User, Item } from '@prisma/client';
import { Request, Response } from "express";
export type ErrorType = { error: string }


type Body<T> = { data: T } | ErrorType;

export type NoId<T> = Omit<T, 'id'>;

export type Query<T> = T | ErrorType

export type Req<T = { id: string }> = Request<T> & { body: Body<T> };
export type Res<T> = Response<Body<T>>

export type ItemWithOrderers = Item & { orderers?: User[] }