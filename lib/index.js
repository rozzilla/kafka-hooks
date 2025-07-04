import { buildStackable } from '@platformatic/service'
import { defaultDlqTopic } from './definitions.js'
import { Generator as _Generator } from './generator.js'
import { plugin } from './plugin.js'
import { packageJson, schema } from './schema.js'

export async function stackable (fastify, opts) {
  await fastify.register(plugin, opts)
}

stackable.Generator = _Generator
stackable.configType = 'kafka-hooks'
stackable.schema = schema
stackable.configManagerConfig = {
  transformConfig () {
    for (const topic of this.current.kafka.topics) {
      if (topic.dlq === true) {
        topic.dlq = defaultDlqTopic
      }
    }
  },
  schemaOptions: {
    useDefaults: true,
    coerceTypes: true,
    allErrors: true,
    strict: false
  }
}

export const Generator = _Generator

export default {
  configType: 'kafka-hooks',
  configManagerConfig: stackable.configManagerConfig,
  /* c8 ignore next 3 */
  async buildStackable (opts) {
    return buildStackable(opts, stackable)
  },
  schema,
  version: packageJson.version
}
