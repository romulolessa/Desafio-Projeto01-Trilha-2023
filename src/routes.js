import { randomUUID } from 'node:crypto';
import moment from 'moment'

import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const database = new Database()

export const routes = [
  //POST
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

        const task = {
            id: randomUUID(),
            title,
            description,
            completed_at: null,
            created_at : moment(new Date()).format('DD/MM/YY-HH:mm'),
            updated_at : moment(new Date()).format('DD/MM/YY-HH:mm'),
        }
        database.insert('tasks', task)
        return res.writeHead(201).end()
    }
  },
  //GET
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,        
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  //PUT
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const data = req.body

      database.update('tasks', id, data ? {
        title: data.title,
        description: data.description,
        updated_at : moment(new Date()).format('DD/MM/YY-HH:mm') 
      } : null)

        return res.writeHead(204).end(0);

    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const {id} = req.params

      database.updateTaskStatus('tasks', id)

      return res.writeHead(204).end()

    }
  },
  //DELETE
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  }
]