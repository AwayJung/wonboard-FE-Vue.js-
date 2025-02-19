<template>
  <div>
    <h1>게시글 목록</h1>
    <div class="link-container">
      <router-link POST to="/articles/post" class="link-style"
        >POST</router-link
      >
      <router-link to="/" class="link-style">HOME</router-link>
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>내용</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(article, index) in articles" :key="index">
            <td>
              <router-link :to="`/articles/${article.id}`">{{
                article.title | truncate
              }}</router-link>
            </td>
            <td>{{ article.content | truncate(20) }}</td>
            <td>{{ article.writer }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination
      :pageNumber="pageNumber"
      :pageSize="pageSize"
      :totalItems="totalItems"
      :totalPages="totalPages"
      @change-page="changePage"
    />
    <!-- <Pagination
      :pageNumber="pageNumber"
      :pageSize="pageSize"
      :totalItems="totalItems"
      @change-page="changePage"
    /> -->
  </div>
</template>

<script>
import { axiosWithAuth } from "@/utils/axios";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "ArticleList",
  components: {
    Pagination,
  },
  data() {
    return {
      articles: [], // 게시글 목록
      totalItems: 0, // 총 게시글 수
      pageNumber: 1, // 현재 페이지 번호
      pageSize: 10, // 한 페이지에 보여줄 게시글 수
      totalPages: 0, // 총 페이지 수
    };
  },
  // 계산된 속성을 의미함
  // computed: {
  //   totalPages() {
  //     return Math.ceil(this.totalItems / this.pageSize);
  //   },
  // },
  methods: {
    async fetchData() {
      try {
        await this.$store.dispatch("refresh");
        console.log("List에서 refresh()호출");
        console.log("accessToken:", this.$store.state.accessToken);
        const accessToken = this.$store.state.accessToken;
        const authInstance = axiosWithAuth(accessToken);
        const response = await authInstance.get(
          `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_API_ARTICLES}?page=${this.pageNumber}&size=${this.pageSize}`
        );
        console.log(response.data.data);
        this.articles = response.data.data.articles;
        this.totalItems = response.data.data.totalArticle;
        this.pageNumber = response.data.data.currentPage;
        this.totalPages = response.data.data.totalPages;
      } catch (e) {
        console.error(e);
      }
    },
    changePage(pageNumber) {
      this.pageNumber = pageNumber;
      this.fetchData();
    },
  },
  async mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

table,
th,
td {
  border: 1px solid #ddd;
  padding: 12px 15px;
}

th {
  background-color: #f3f3f3;
  color: #333;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}
th:nth-child(3),
td:nth-child(3) {
  width: 10%;
}

th:nth-child(2),
td:nth-child(2) {
  width: 60%;
}

.link-style {
  color: #4caf50;
  text-decoration: none;
  margin-right: 20px;
}

.link-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
