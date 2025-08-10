
import  apiClient, { getAuthHeaders }  from "../axiosInstance";



export const HomeService = {

  getExamFaculty: async () => {
    try {
      
      const response = await apiClient.get('home/get_faculty_exam',{
        headers : getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      // throw new Error('Failed to fetch profile');
      console.log(error)
    }
  },

  getHome: async (deviceId, version) => {
    try {
      const response = await apiClient.get(`/home?device-id=1e93c8e53b298c11&version=2.1`,{
        headers : getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },

  getArchiveQuestions: async (faculty_id,exam_id,filter=1,page=1) => {
    try {
      const response = await apiClient.get(`/archive/get_archive?faculty_id=${faculty_id}&batch_id&exam_id=${exam_id}&filter=${filter}&search=&page=${page}`, { 
        headers : getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  },

  getExamQuestion: async (id) => {
    try {
      const response = await apiClient.get(`/archive/get_question?question_id=${id}`,{
        headers : getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  },

  userBatchEnroll: async (id) => {
    try {
      const response = await apiClient.post(`/profile/user_batch_enroll`,
        { batch_id: id },
        { headers : getAuthHeaders(),}
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  },

  getAllBatch: async (faculty, exam, page) => {
    try {
      const response = await apiClient.get(`batch?faculty_id=${faculty}&exam_type=${exam}&page=${page}`,{
        headers : getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  },

  getBatchDetails: async (batch_id) => {
    try {
      const response = await apiClient.get(`batch?batch_id=${batch_id}`,{
        headers : getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get Batch Details');
    }
  },


  getMeritList: async (batch_id,type,page) => {
    try {
      const response = await apiClient.get(`exam?merit_list_by_question_id&merit_list_by_batch_id=${batch_id}&type=${type}&page=${page}`,{
        headers : getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get Merit List');
    }
  },

  submitExam : async (data) => {
    
    try {
      const response = await apiClient.post(`exam/answer_submit`,
        { question_id : data.question_id, answers : data.answers },
        { headers : getAuthHeaders(),}
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete user');
    }

  },

  getRoutine: async (batch_id,faculty_id,exam_type_id,page) => {
    try {
      const response = await apiClient.get(`exam?batch_id=${batch_id}&faculty_id=${faculty_id}&exam_type_id=${exam_type_id}&page=${page}`,{
        headers : getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get Routine');
    }
  },

  getResult: async (batch_id,faculty_id,exam_type_id,page) => {
    try {
      const response = await apiClient.get(`exam?central_result_faculty_id=${faculty_id}&central_result_exam_type_id=${exam_type_id}&central_batch_id=${batch_id}&search=&page=${page}`,{
        headers : getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get Result');
    }
  },

  getMarkSheet: async (question_id,type) => {
    try {
      const response = await apiClient.get(`exam?mark_sheet_by_question_id=${question_id}&type=${type}`,{
        headers : getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get Mark Sheet');
    }
  },

  getAnswerSheet: async (question_id,answer_id,sort) => {
    try {
      const response = await apiClient.get(`exam?answere_sheet_question_id=${question_id}&answer_id=${answer_id}&sort=${sort}`,{
        headers : getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get Answer Sheet');
    }
  },


  setUserFacultyExam: async (exam_id,faculty_id) => {
    try {
      const response = await apiClient.post(`profile/set_user_faculty_exam`,
        { exam_type: exam_id, faculty_id : faculty_id },
        { headers : getAuthHeaders(),}
      );
      return response.data;
    } catch (error) {
      throw new Error('setFaculty Failed');
    }
  },


  getMyStudy: async (exam_id,faculty_id) => {
    try {
      const response = await apiClient.get(`home/get_my_study?faculty_id=${faculty_id}&exam_type=${exam_id}`,
        { headers : getAuthHeaders()}
      );
      return response.data;
    } catch (error) {
      throw new Error('setFaculty Failed');
    }
  },

  setUserDefaultBatch: async (batch_id) => {
    try {
      const response = await apiClient.post(`profile/set_default_batch`,
        { batch_id: batch_id},
        { headers : getAuthHeaders(),}
      );
      return response.data;
    } catch (error) {
      throw new Error('set Default batch Failed');
    }
  },

  getBatchVideo: async (batch_id,page = 1) => {
    try {
      const response = await apiClient.get(`study_content/get_batch_wise_video_series?batch_id=${batch_id}&page=${page}`,
        { headers : getAuthHeaders()}
      );
      return response.data;
    } catch (error) {
      throw new Error('setFaculty Failed');
    }
  },


  


};