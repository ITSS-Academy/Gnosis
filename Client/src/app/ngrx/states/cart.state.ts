import { Course } from 'src/app/models/course.model';

export interface CartState {
  cartList: Course[];
  courseList: Course[];
  total: number;
}
