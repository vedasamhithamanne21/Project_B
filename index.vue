<template>
  <div class="container">
    <h1>CSV File Manager</h1>
    
    <!-- File Upload Section -->
    <form @submit.prevent="uploadFile" class="upload-form">
      <input type="file" @change="handleFileUpload" accept=".csv" />
      <button type="submit" :disabled="!selectedFile">Upload File</button>
    </form>

    <!-- File List Component -->
    <FileList :files="files" @fileSelected="viewFileDetails" />
    
    <!-- File Content Display -->
    <div v-if="selectedFileContent" class="file-content">
      <h2>File Content: {{ selectedFileName }}</h2>
      <table>
        <thead>
          <tr>
            <th v-for="column in selectedFileColumns" :key="column">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in selectedFileContent" :key="index">
            <td v-for="(value, key) in row" :key="key">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import FileList from '~/components/FileList.vue';

export default {
  components: {
    FileList
  },
  data() {
    return {
      selectedFile: null,
      files: [],
      selectedFileContent: null,
      selectedFileColumns: [],
      selectedFileName: '',
    };
  },
  async mounted() {
    await this.fetchFileList();
  },
  methods: {
    // Handle file input change
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    // Upload the selected CSV file
    async uploadFile() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        await axios.post('http://localhost:3001/api/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('File uploaded successfully');
        this.selectedFile = null;
        await this.fetchFileList(); // Refresh file list after upload
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    },
    // Fetch the list of uploaded files from the backend
    async fetchFileList() {
      try {
        const response = await axios.get('http://localhost:3001/api/files/list');
        this.files = response.data;
      } catch (error) {
        console.error('Error fetching file list:', error);
      }
    },
    // View the details of a selected file
    async viewFileDetails(file) {
      try {
        const response = await axios.get(`http://localhost:3001/api/files/${file.id}`);
        this.selectedFileContent = response.data.data; // Assuming response has CSV data
        this.selectedFileColumns = JSON.parse(file.columns);
        this.selectedFileName = file.filename;
      } catch (error) {
        console.error('Error retrieving file details:', error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
.upload-form {
  margin-bottom: 20px;
}
.file-content {
  margin-top: 30px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
