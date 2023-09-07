/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { select } from '@ngrx/store';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) { }

  async create(createCourseDto: CreateQuestionDto): Promise<Question> {
    try {
      const createdCat = new this.questionModel(createCourseDto);
      return createdCat.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(): Promise<Question[]> {
    try {
      return await this.questionModel
        .find()
        .select('-createdAt -updatedAt -__v')
        .populate('quizBank', '-createdAt -updatedAt -__v')
        .exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: string): Promise<Question[]> {
    try {
      return await this.questionModel
        .find({
          quizId: id,
        })
        .select('-createdAt -updatedAt -__v')
        .populate('quizBank', '-createdAt -updatedAt -__v')
        .populate('quizId')
        .exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    try {
      const updateQuestion = await this.questionModel.findOneAndUpdate(
        { _id: id },
        { ...updateQuestionDto },
        { new: true },
      );
      return updateQuestion;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: string): Promise<Question> {
    try {
      const deleteQuestion = await this.questionModel.findOneAndDelete({
        _id: id,
      });
      return deleteQuestion;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
