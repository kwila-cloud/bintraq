import { MessagesApi, Configuration, UsageApi } from 'smoketree-ts'
import { getOrganization } from './utils'

export const sendMessages = async (messages: { to: string; content: string }[]) => {
  const organization = await getOrganization()
  const configuration = new Configuration({
    apiKey: organization.smoketreeAdminApiKey,
  })
  const messagesApi = new MessagesApi(configuration)
  const { data } = await messagesApi.postMessageCreate({ messages })
  return data.results
}

export const getMessages = async () => {
  const organization = await getOrganization()
  const configuration = new Configuration({
    apiKey: organization.smoketreeAdminApiKey,
  })
  const messagesApi = new MessagesApi(configuration)
  const { data } = await messagesApi.getMessageList()
  return data.messages
}

export const getMessage = async (messageUuid:string) => {
  const organization = await getOrganization()
  const configuration = new Configuration({
    apiKey: organization.smoketreeAdminApiKey,
  })
  const messagesApi = new MessagesApi(configuration)
  const { data } = await messagesApi.getMessageFetch(messageUuid)
  return data
}

export const resendMessage = async (messageUuid:string) => {
  const organization = await getOrganization()
  const configuration = new Configuration({
    apiKey: organization.smoketreeAdminApiKey,
  })
  const messagesApi = new MessagesApi(configuration)
  const { data } = await messagesApi.postMessageRetry(messageUuid)
  return data
}

export const getUsage = async () => {
  const organization = await getOrganization()
  const configuration = new Configuration({
    apiKey: organization.smoketreeAdminApiKey,
  })
  const usageApi = new UsageApi(configuration)
  const { data } = await usageApi.getUsageStatsGetAll()
  return data
}
