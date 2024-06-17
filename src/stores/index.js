import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
    // 사용자 정보를 저장할 상태
    state: {
        loginEmail: null,
        accessToken: null,
        refreshToken: null,
        accessTokenExpire: null,
        isLoggedIn: false
    },
    // 사용자 정보를 변경하는 메서드
  mutations: {
  setLoginEmail(state, loginEmail) {
    state.loginEmail = loginEmail;
    localStorage.setItem('loginEmail', loginEmail);
  },
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
    localStorage.setItem('accessToken', accessToken);
  },
  setRefreshToken(state, refreshToken) {
    state.refreshToken = refreshToken;
    localStorage.setItem('refreshToken', refreshToken);
  },
  setAccessTokenExpire(state, accessTokenExpire) {
    state.accessTokenExpire = accessTokenExpire;
  },
  setIsLoggedIn(state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn;
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }
},

    // 사용자 정보를 변경하는 비동기 메서드
    actions: {
        // 로그인
       async login({ commit }, { loginEmail, password }) {
    try {
        console.log("store에서 로그인시도");
      const response = await axios.post( `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_API_USER_LOGIN}`, { loginEmail, password });
        console.log(response);
      if (response.data.result === 'success') {
        commit('setLoginEmail', response.data.data.loginEmail);
        commit('setAccessToken', response.data.data.accessToken);
        commit('setRefreshToken', response.data.data.refreshToken);
        commit('setAccessTokenExpire', Date.now() + 50000);
        commit('setIsLoggedIn', true);

        return response;
      } else {
        return { result: false, message: response.data.message };
      }
    } catch (error) {
      if(error.response.status === 401) {
        alert('아이디 또는 비밀번호가 틀렸습니다.');
        return { result: false, message: '아이디 또는 비밀번호가 틀렸습니다.' };
        
      }else if(error.response.status === 500) {
      console.error(error);
      alert('로그인 중 에러가 발생했습니다.');
      return { success: false, message: '로그인 중 에러가 발생했습니다.' };
    }else if(error.response.status === 400) {
      alert(' 이메일 형식으로 입력해주세요.');  
      return { success: false, message: '이메일 형식으로 입력해주세요.' };
    }
    }
  },

      // 로그아웃
        logout({ commit }) {
            commit("setLoginEmail", null);
            commit("setAccessToken", null);
            commit("setRefreshToken", null);
            commit("setIsLoggedIn", false);
            localStorage.clear();
            alert("로그아웃 되었습니다.");
        if (router.currentRoute.path !== '/') {
  router.push('/');
}
        },

        // 토큰 갱신
    async refresh({ state, commit }) {
      const now = Date.now();
      if(state.accessTokenExpire < now) {
        try{
           const response = await axios.post( `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_API_USER_REFRESH_TOKEN}`, 
                                          {},
                                          { headers: { 
                                              'Authorization': `Bearer ${state.accessToken}`,
                                              'refreshToken': state.refreshToken 
                                          } });
            if(response.data.result === 'success') {
                commit('setAccessToken', response.data.data.accessToken);
                commit('setRefreshToken', response.data.data.refreshToken);  
                commit('setAccessTokenExpire', Date.now() + 50000); 
                localStorage.setItem('accessToken', response.data.data.accessToken);
                console.log('accessToken 갱신 성공', response.data.data.accessToken);
                console.log('refreshToken 갱신 성공', response.data.data.refreshToken);
                return response;
            } else {
                throw new Error('토큰 갱신 실패');
            }
        }catch(error){
            console.error(error);
            return { result: false, message: '토큰 갱신 중 에러가 발생했습니다.' };
        }
    }
  }
    },
    plugins: [createPersistedState()],
});