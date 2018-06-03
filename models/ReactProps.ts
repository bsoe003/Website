import { ReactNode } from 'react';

export default interface ReactProps {
  className?: string;
  id?: string;
  children?: ReactNode;
  key?: string;
}
