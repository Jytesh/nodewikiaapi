const WikiaAPI = require('../main')

test('limit is working', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getLatestActivity(10, 0).then(data => {
    expect(data.items.length).toBe(10)
  })
})

test('LatestActivity must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getLatestActivity(10, 0).then(data => {
    expect(typeof data).toBe('object')
  })
})

test('RecentlyChangedArticles must return an object', () => {
  expect.assertions(1)
  return new WikiaAPI('dev').getRecentlyChangedArticles(10, 0).then(data => {
    expect(typeof data).toBe('object')
  })
})
