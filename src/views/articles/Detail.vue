<template>
  <div>
    <h2 class="form-group">게시글 상세</h2>
    <div class="form-container">
      <div class="author-info">
        <h2>{{ article.title }}</h2>
        <p>{{ article.writer }}</p>
        <p>{{ article.content }}</p>
        <!-- <img :src="imagePath" alt="Article image" /> -->
      </div>
      <div v-if="article.writer === $store.state.name">
        <router-link :to="`/articles/edit/${article.id}`" class="submit-button"
          >수정</router-link
        >
        <button class="submit-button" @click="deleteArticle">삭제</button>
      </div>
    </div>
    <div class="link-container">
      <router-link to="/articles/list" class="link-style">목록으로</router-link>
      <router-link to="/" class="link-style">HOME</router-link>
    </div>
  </div>
</template>
<script>
// import axios from "axios";
import { axiosWithAuth } from "@/utils/axios";
export default {
  name: "ArticleDetailView",
  data() {
    return {
      article: {},
    };
  },
  // computed: {
  //   imagePath() {
  //     if (!this.article.path) return "";
  //     return `${process.env.VUE_APP_API_BASE_URL}/images/${this.article.path}`;
  //   },
  // },
  async created() {
    this.fetchArticle();
  },
  methods: {
    async fetchArticle() {
      console.log(this.$store.state.name);
      const articleId = this.$route.params.id;
      try {
        await this.$store.dispatch("refresh");
        console.log("Detail에서 refresh()호출");
        console.log("accessToken:", this.$store.state.accessToken);
        const accessToken = this.$store.state.accessToken;
        const axiosInstance = axiosWithAuth(accessToken);
        const response = await axiosInstance.get(
          `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_API_ARTICLES}${articleId}`
        );
        this.article = response.data.data;
      } catch (e) {
        console.error(e);
        alert("게시글을 불러오는 중 오류가 발생했습니다");
      }
    },
    async deleteArticle() {
      if (!confirm("게시글을 삭제하시겠습니까?")) {
        return;
      }
      try {
        await this.$store.dispatch("refresh");
        console.log("토큰", this.$store.state.accessToken);
        const accessToken = this.$store.state.accessToken;
        const axiosInstance = axiosWithAuth(accessToken);
        await axiosInstance.delete(
          `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_API_ARTICLES}${this.$route.params.id}`
        );
        this.$router.push("/articles/list");
      } catch (e) {
        console.error(e);
        alert("게시글을 삭제하는 중 오류가 발생했습니다");
      }
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f8f9fa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  height: 700px;
}

.form-group {
  margin-bottom: 15px;
  font-size: 1.5em;
  color: #333;
}

.author-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}

.author-info h2 {
  font-size: 1.3em;
  color: #333;
}

.author-info p {
  font-size: 1em;
  color: #666;
}

.submit-button {
  padding: 5px 10px;
  background-color: #d3d3d3;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  text-decoration: none;
  font-size: 0.8em;
  transition: background-color 0.3s ease;
  float: right;
}

.submit-button:hover {
  background-color: #b3b3b3;
}

.link-container {
  margin-top: 20px;
  margin-bottom: 20px;
}

.link-style {
  color: #007bff;
  text-decoration: none;
  margin-right: 10px;
}

.link-style:hover {
  text-decoration: underline;
}
</style>
