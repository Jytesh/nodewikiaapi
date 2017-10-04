'use strict'

const got = require('got')

/**
 * Class representing WikiaAPI V1
 * @param {string} subdomain - Subdomain, for example "dev" or "pl.community"
 */
class WikiaAPI {
  constructor (subdomain) {
    if (!subdomain) {
      throw new Error('Argument \'subdomain\' is required')
    }
    /**
     * Subdomain, for example "dev" or "pl.community"
     * @see [Help:URL]{@link http://community.wikia.com/wiki/Help:URL} on Community Central
     *
     * @name WikiaAPI#subdomain
     * @type {string}
     */
    this.subdomain = subdomain
  }

  /**
   * Get latest activity information
   * @see [Wikia API Documentation]{@link http://dev.wikia.com/api/v1#!/Activity/getLatestActivity_get_0}
   *
   * @param {number} [limit=10] - Limit the number of results
   * @param {(number[]|number)} [namespaces=0] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {boolean} [allowDuplicates=true] - Set if duplicate values of an article's revisions made by the same user are not allowed
   * @return {Promise<Object, Error>} A Promise with an Object containing latest activity on fulfil, and Error on rejection
   *
   * @instance
   * @memberof WikiaAPI
   */
  getLatestActivity (limit = 10, namespaces = 0, allowDuplicates = true) {
    if (isNaN(limit)) {
      throw new Error('Argument \'limit\' must be a number')
    }

    let ns = []
    if (Array.isArray(namespaces)) {
      ns = namespaces
    } else if (!isNaN(namespaces)) {
      ns = [namespaces]
    } else {
      throw new Error('Argument \'namespaces\' must be a number or array of numbers')
    }

    return new Promise((resolve, reject) => {
      this._makeRequest('Activity/LatestActivity', {
        limit: limit,
        namespaces: ns.join(','),
        allowDuplicates: allowDuplicates
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get recently changed articles
   * @see [Wikia API Documentation]{@link http://dev.wikia.com/api/v1#!/Activity/getRecentlyChangedArticles_get_1}
   *
   * @param {number} [limit=10] - Limit the number of results
   * @param {(number[]|number)} [namespaces=0] - Array of namespace ids or a single namespace id, see more: {@link http://community.wikia.com/wiki/Help:Namespaces}
   * @param {boolean} [allowDuplicates=true] - Set if duplicate values of an article's revisions made by the same user are not allowed
   * @return {Promise<Object, Error>} A Promise with an Object containing recently changed articles on fulfil, and Error on rejection
   *
   * @instance
   * @memberof WikiaAPI
   */
  getRecentlyChangedArticles (limit = 10, namespaces = 0, allowDuplicates = true) {
    if (isNaN(limit)) {
      throw new Error('Argument \'limit\' must be a number')
    }

    let ns = []
    if (Array.isArray(namespaces)) {
      ns = namespaces
    } else if (!isNaN(namespaces)) {
      ns = [namespaces]
    } else {
      throw new Error('Argument \'namespaces\' must be a number or array of numbers')
    }

    return new Promise((resolve, reject) => {
      this._makeRequest('Activity/RecentlyChangedArticles', {
        limit: limit,
        namespaces: ns.join(','),
        allowDuplicates: allowDuplicates
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get simplified article contents
   * @see [Wikia API Documentation]{@link http://dev.wikia.com/api/v1#!/Articles/getAsSimpleJson_get_0}
   *
   * @param {number} id - A single article ID
   * @return {Promise<Object, Error>} - A Promise with an Object containing simple article data on fulfil, and Error on rejection
   *
   * @instance
   * @memberof WikiaAPI
   */
  getArticleAsSimpleJson (id) {
    if (isNaN(id)) {
      throw new Error('Argument \'id\' is required')
    }

    return new Promise((resolve, reject) => {
      this._makeRequest('Articles/AsSimpleJson', {
        id: id
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Get details about one or more articles
   * @see [Wikia API Documentation]{@link http://dev.wikia.com/api/v1#!/Articles/getDetails_get_1}
   *
   * @param {(number[]|number)} ids - An Array of article ids or a single article id, pass -1 if you want to search only using titles
   * @param {(string[]|string)} [titles] - An Array of article titles or a single article title, can be used alongside ids
   * @param {number} [abstract=100] - The desired length for the article's abstract
   * @param {number} [width=200] - The desired width for the thumbnail
   * @param {number} [height=200] - The desired height for the thumbnail
   */
  getArticlesDetails (ids = -1, titles = '', abstract = 100, width = 200, height = 200) {
    if (ids === -1 && titles === '') {
      throw new Error('Argument \'ids\' or \'titles\' should be passed')
    }

    let queryIds = []
    if (Array.isArray(ids)) {
      queryIds = ids
    } else if (!isNaN(ids)) {
      queryIds = [ids]
    } else {
      throw new Error('Argument \'ids\' must be a number or array of numbers')
    }

    let queryTitles = []
    if (Array.isArray(titles)) {
      queryTitles = titles
    } else if (typeof titles === 'string') {
      queryTitles = [titles]
    } else {
      throw new Error('Argument \'titles\' must be a string or array of strings')
    }

    return new Promise((resolve, reject) => {
      this._makeRequest('Articles/Details', {
        ids: queryIds.join(','),
        titles: queryTitles.join(','),
        abstract: abstract,
        width: width,
        height: height
      }).then(body => {
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * Basepath of Wikia API V1 for given subdomain
   * @name WikiaAPI#url
   * @type {string}
   * @readonly
   */
  get url () {
    return `http://${this.subdomain}.wikia.com/api/v1/`
  }
  set url (value) {
    throw new Error('Cannot set a read-only property \'url\'')
  }

  /**
   * Basepath of wiki for given subdomain
   * @name WikiaAPI#basepath
   * @type {string}
   * @readonly
   */
  get basepath () {
    return `http://${this.subdomain}.wikia.com`
  }
  set basepath (value) {
    throw new Error('Cannot set a read-only property \'basepath\'')
  }

  _makeRequest (endpoint, params) {
    return new Promise((resolve, reject) => {
      let query = []
      for (let param in params) {
        query.push(param + '=' + encodeURIComponent(params[param]))
      }

      got(`${this.url}${endpoint}?${query.join('&')}`).then(response => {
        let body
        try {
          body = JSON.parse(response.body)
        } catch (error) {
          reject(new Error('Community not found'))
        }
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = WikiaAPI
