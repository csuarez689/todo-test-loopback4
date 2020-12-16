import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody} from '@loopback/rest';
import {TodoList} from '../models';
import {TodoListRepository} from '../repositories';

export class TodoListController {
  constructor(
    @repository(TodoListRepository)
    public todoListRepository: TodoListRepository,
  ) {}

  @post('/todo-lists', {
    responses: {
      '200': {
        description: 'TodoList model instance',
        content: {'application/json': {schema: getModelSchemaRef(TodoList)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {
            title: 'NewTodoList',
            exclude: ['id'],
          }),
        },
      },
    })
    todoList: Omit<TodoList, 'id'>,
  ): Promise<TodoList> {
    return this.todoListRepository.create(todoList);
  }

  @get('/todo-lists', {
    responses: {
      '200': {
        description: 'Array of TodoList model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TodoList, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(TodoList) filter?: Filter<TodoList>): Promise<TodoList[]> {
    return this.todoListRepository.find(filter);
  }

  @get('/todo-lists/{id}', {
    responses: {
      '200': {
        description: 'TodoList model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TodoList, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TodoList, {exclude: 'where'}) filter?: FilterExcludingWhere<TodoList>,
  ): Promise<TodoList> {
    return this.todoListRepository.findById(id, filter);
  }

  @patch('/todo-lists/{id}', {
    responses: {
      '204': {
        description: 'TodoList PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {partial: true}),
        },
      },
    })
    todoList: TodoList,
  ): Promise<void> {
    await this.todoListRepository.updateById(id, todoList);
  }

  @put('/todo-lists/{id}', {
    responses: {
      '204': {
        description: 'TodoList PUT success',
      },
    },
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() todoList: TodoList): Promise<void> {
    await this.todoListRepository.replaceById(id, todoList);
  }

  @del('/todo-lists/{id}', {
    responses: {
      '204': {
        description: 'TodoList DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoListRepository.deleteById(id);
  }
}
