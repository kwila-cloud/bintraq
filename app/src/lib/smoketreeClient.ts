import { MessagesApi, Configuration } from 'smoketree-ts'
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
