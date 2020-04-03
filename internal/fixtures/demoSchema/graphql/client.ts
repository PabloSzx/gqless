import { Client } from '@pablosz/gqless'
import { schema, Query } from './generated'
import { fetchQuery } from '../fetchQuery'

export const createGraphQL = () => new Client<Query>(schema.Query, fetchQuery)
