
const BASE_URL = 'http://dhk.cracktech.org:8004/'
const API_VERSION = 'api/v1/'
const HOME = "home/"

const HOME_URLS = {
  getFacultyExam : "get_faculty_exam"
}

const BATCH_URLS = {
    upcomingBatch : '/',
    runningBatch : '/',
    userBatch : '/'
}


const AUTH_URLS = {
    login : '/login/',
    logout : '/logout/',
    userBatch : '/'
}

const QUESTION_URLS = {
    archiveQuestion : '',
    liveQuestion : ''
}

const ANSWER_URLS = {
    userAnswerSheet : ''
}

class URLManager {

  constructor() {
    this.baseUrl = BASE_URL;
    this.apiVersion = API_VERSION;
  }

  

}