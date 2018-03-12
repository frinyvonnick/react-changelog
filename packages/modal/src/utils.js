import { flow, get } from 'lodash'
import { split, tail, chunk, map } from 'lodash/fp'

import cmp from 'semver-compare'

const delimiter = '---'

export const hasMarkdownMetaData = rawMarkdown => rawMarkdown.includes(delimiter)

export const splitMarkdown = (rawMarkdown) => {
  if (!rawMarkdown || !rawMarkdown.includes(delimiter)) return rawMarkdown

  return flow([
    split(delimiter),
    tail,
    chunk(2),
    map(([metadata, body]) => `${delimiter}${metadata}${delimiter}${body}`),
  ])(rawMarkdown)
}

const compare = baseVersion => versionToCompare => cmp(baseVersion, versionToCompare)

export const versionPredicate = version => (f) => {
  if (!version) return true

  const compareToFeature = compare(f.attributes.version)
  const isInferiorOrEqualToProvidedVersion = compareToFeature(version) <= 0

  if (!isInferiorOrEqualToProvidedVersion) return false

  const majorVersion = `${version.split('.')[0]}.0.0`
  const storedVersion = localStorage.getItem('changelog-version')
  const hasStoredVersion = Boolean(storedVersion)

  const isSuperiorToFeature = versionToCompare => compareToFeature(versionToCompare) > 0
  const isSuperiorToMajorVersion = isSuperiorToFeature(majorVersion)

  if (hasStoredVersion) {
    if (isSuperiorToFeature(storedVersion)) return true
  } else if (isSuperiorToMajorVersion) return true

  return false
}

export const sortBy = path => (a, b) => cmp(get(a, path), get(b, path))
