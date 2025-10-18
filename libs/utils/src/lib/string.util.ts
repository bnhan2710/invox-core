import { v4 as uuidv4 } from 'uuid';
import { UnauthorizedException } from '@nestjs/common';

export const getProcesssId = (prefix?: string) => {
  return prefix ? `${prefix}-${uuidv4()}` : uuidv4();
};

export const parseToken = (token: string): string => {
  if (!token?.trim()) {
    throw new UnauthorizedException('Token is required');
  }

  if (token.includes(' ')) {
    return token.split(' ')[1];
  }

  return token;
};
