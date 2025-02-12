<template>
  <section class="mt-28 mx-auto mb-10 text-center min-h-screen">
    <Flashmessage class="bg-blue-500" v-if="successMsg">
      {{ successMsg }}
    </Flashmessage>
    <!-- Images swiper -->
    <div
      class="dark:bg-gray-700/50 backdrop-blur-md dark:bg-none mx-auto bg-gradient-to-r from-green-500 via-violet-500 to-blue-500 shadow-md rounded-xl p-1"
    >
      <div class="bg-blue-50 overflow-hidden rounded-xl">
        <swiper
          :slidesPerView="1"
          :spaceBetween="30"
          :loop="true"
          :pagination="{
            clickable: true,
          }"
          :navigation="true"
          :modules="modules"
          class="mySwiper dark:bg-gray-700"
        >
          <Swiper-slide
            class="flex justify-center items-center"
            v-for="file of availableFiles"
            :key="file"
          >
            <img class="rounded-xl py-2" :src="file" alt="" />
          </Swiper-slide>
        </swiper>
      </div>
    </div>

    <div class="dark:text-white">
      <div class="mt-6">
        <h4 class="text-left text-lg font-semibold mb-3">Component Name:</h4>
        <p class="text-left dark:text-gray-200 leading-relaxed">
          {{ name }}
        </p>
      </div>
      <div class="mt-6">
        <h4 class="text-left text-lg font-semibold mb-3">
          Component description:
        </h4>
        <p class="text-left dark:text-gray-200 leading-relaxed">
          {{ description }}
        </p>
      </div>
      <div class="mt-6">
        <h4 class="text-left text-lg font-semibold mb-3">Component Code:</h4>
        <p
          class="bg-gray-900 py-1 px-2 rounded-xl w-fit text-left dark:text-gray-200 leading-relaxed"
        >
          - You can
          <Secondarybtn @click="copyCode" class="cursor-pointer w-fit mx-2 my-2"
            >Copy Code</Secondarybtn
          >
          the code of this component and test it in
          <a
            class="underline text-blue-500 font-semibold hover:text-white"
            href="//play.tailwindcss.com/"
            target="_blank"
            >TailwindCSS Playground</a
          >
        </p>
      </div>
    </div>

    <div
      class="mx-auto mt-6 flex-col gap-3 w-fit sm:w-full justify-center sm:justify-between items-center sm:items-stretch sm:gap-0 sm:flex-row bg-gradient-to-r from-green-400/20 to-blue-500/20 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 background-animate shadow-md rounded-xl p-2 flex"
    >
      <div class="flex items-center gap-2 group">
        <router-link
          :to="{
            name: 'UserProfile',
            params: { id: this.ownerId },
          }"
        >
          <img
            :src="profilePic"
            class="rounded-full h-12 w-12 border-black dark:border-white border-2 transition-transform group-hover:scale-110 z-50"
            alt=""
          />
        </router-link>
        <router-link
          :to="{
            name: 'UserProfile',
            params: { id: this.ownerId },
          }"
        >
          <h4
            class="font-semibold hover:text-blue-500 text-sm sm:text-base dark:text-gray-300 dark:hover:text-white"
          >
            {{ owner }}
          </h4>
        </router-link>
      </div>
      <a :href="'//' + gitHubAcc" target="_blank">
        <Infobtn class="max-w-fit cursor-pointer">
          <div
            class="flex justify-center items-center gap-1 text-sm sm:text-base"
          >
            <span
              ><img
                src="../../assets/images/github.png"
                alt=""
                id="githubIcon"
                class="inline-block sm:w-10"
            /></span>
            Github
          </div></Infobtn
        >
      </a>
    </div>
    <div class="relative">
      <Addcomment class="mt-6">
        <Infobtn @click="postComment" class="w-fit cursor-pointer"
          >Post Comment</Infobtn
        >
        <div v-if="isLoading" class="absolute bottom-3 left-3">
          <div class="ripple-loader">
            <div></div>
            <div></div>
          </div>
        </div>
      </Addcomment>
    </div>

    <div v-for="document in availableComments" :key="document.$id">
      <Transition appear name="slide-fade">
        <Comments
          :commentOwner="document.commentOwner"
          :commentOwnerId="document.commentOwnerId"
          :commentContext="document.commentContext"
          :commentId="document.$id"
          :dateAndTime="document.dateAndTime"
          :commentProfilePic="this.commentProfilePic"
          class="my-6"
        >
          <!-- show edit button only if the logged in user is the comment owner -->
          <div
            @click="deleteComment(document.$id)"
            v-if="document.commentOwnerId == store.userprofile.$id"
            class="w-fit absolute bottom-3 right-6 font-semibold text-sm text-red-500 cursor-pointer hover:text-red-700"
          >
            DELETE
          </div>
        </Comments>
      </Transition>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";

import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules for swiper
import { Pagination, Navigation } from "swiper";

import { store } from "../../store";
import { appwrite } from "../../utils";
import Infobtn from "../buttons/Infobtn.vue";
import Secondarybtn from "../buttons/Secondarybtn.vue";
import Addcomment from "../Addcomment.vue";
import Comments from "../Comments.vue";
import Flashmessage from "../Flashmessage.vue";

import { getFiles } from "../../services/bucketsService";
import { getUserPref } from "../../services/UserService";

export default {
  components: {
    Swiper,
    SwiperSlide,
    Infobtn,
    Addcomment,
    Comments,
    Flashmessage,
    Secondarybtn,
  },
  setup() {
    return {
      modules: [Pagination, Navigation],
      store,
    };
  },
  data() {
    return {
      name: null,
      description: null,
      owner: false,
      ownerId: false,
      componentCode: false,
      gitHubAcc: "",
      successMsg: false,
      isLoading: false,
      componentId: false,
      collectionId: false,
      availableComments: [],
      commentContext: null,
      deletedCommentId: false,
      dateAndTime: false,
      availableFiles: [],
      profilePic: "",
      commentProfilePic: "",
    };
  },
  mounted() {
    this.getComponentDetails();
    this.getAllFiles();
    this.checkForComments();
  },

  methods: {
    // Getting component details from params and passed to appwrite
    async getComponentDetails() {
      // Fetch component ID and colleciton ID from the params in route
      this.componentId = this.$route.params.id;
      this.collectionId = this.$route.params.colname;

      // Getting the document by Collection ID and Component ID
      let promise = appwrite.database.getDocument(
        this.collectionId,
        this.componentId
      );

      await promise.then((response) => {
        // Getting current component details
        this.name = response.name;
        this.description = response.description;
        this.owner = response.owner;
        this.ownerId = response.ownerId;
        this.componentCode = response.code;
      });

      this.getProfilePic();
      this.getGithub();
    },
    async getGithub() {
      await getUserPref(this.ownerId).then((response) => {
        this.gitHubAcc = response.github;
      });
    },
    // Fetch the code from the document and copy to clip board
    async copyCode() {
      let code = this.componentCode;
      var input = document.createElement("input");
      input.setAttribute("value", code);
      input.value = code;
      document.body.appendChild(input);
      try {
        input.select();
        input.click();
        input.focus();
        var successful = document.execCommand("copy");
        var msg = successful
          ? (this.successMsg = "Code copied to clipboard 🥳")
          : (this.successMsg = "Couldn't copy the code");
      } catch (err) {
        console.log(err);
      }
      document.body.removeChild(input);
    },
    async checkForComments() {
      this.availableComments = [];
      // Getting list of documents(ALL) inside comments collection
      let promise = appwrite.database.listDocuments("comments");

      await promise.then((response) => {
        // Filtering each document to check if it relates to the current component
        // Don't show comments with ID equal to deleted comment ID (For immediate view purposes)
        for (const document of response.documents) {
          if (
            document.componentId == this.componentId &&
            document.$id !== this.deletedCommentId
          ) {
            this.availableComments.push(document);
          }
        }
      });
    },
    async getAllFiles() {
      //Using Node SDK to fetch all files (images) in the desired bucket
      await getFiles(this.componentId).then((response) => {
        //loop over files
        for (const file of response.files) {
          // Get file preview for each file using web sdk
          let result = appwrite.storage.getFilePreview(
            this.componentId,
            file.$id
          );
          this.availableFiles.push(result.href);
        }
      });
    },
    // get time in EDT
    currentDateTime() {
      const date = new Date();
      const currentDT = date.toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });
      this.dateAndTime = currentDT;
    },
    async postComment() {
      this.currentDateTime();
      //creating appwrite document for the comment while passing comment context
      this.commentContext = document.querySelector("#commentContext").value;
      let promise = appwrite.database.createDocument("comments", "unique()", {
        commentOwner: store.userprofile.name,
        commentOwnerId: store.userprofile.$id,
        componentId: this.componentId,
        commentContext: this.commentContext,
        dateAndTime: this.dateAndTime,
      });

      // Clear comment text area after adding new comment.
      document.querySelector("#commentContext").value = "";
      // Give some time for appwrite to load and then check for updated comments
      this.isLoading = true;
      this.successMsg = "Your comment has been added 🥳";
      setTimeout(() => {
        this.isLoading = false;
        this.checkForComments();
      }, 1000);
    },
    // Delete the comment (Passed comment ID value from the loop in template)
    async deleteComment(commentId) {
      this.deletedCommentId = commentId;
      await appwrite.database.deleteDocument("comments", commentId);
      // Give some time for appwrite to load and then check for updated comments
      this.isLoading = true;
      this.successMsg = "Your comment has been deleted ☹️";
      setTimeout(() => {
        this.isLoading = false;
        this.checkForComments();
      }, 1000);
    },
    getProfilePic() {
      //Using Node SDK to fetch all files (images) in the desired bucket
      getFiles(this.ownerId).then(
        (response) => {
          if (response.code == 404) {
            this.profilePic = null;
            this.getAvatar();
          } else {
            for (const file of response.files) {
              let result = appwrite.storage.getFilePreview(
                this.ownerId,
                file.$id
              );
              this.profilePic = result.href;
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    getAvatar() {
      let result = appwrite.avatars.getInitials(this.owner);

      this.profilePic = result.href;
    },
  },
};
</script>

<style scoped>
#githubIcon {
  max-width: 1.5rem !important;
}
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  max-height: 25rem;
  object-fit: cover;
}

.swiper {
  margin-left: auto;
  margin-right: auto;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
