<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>{{ info }}</h2>
    <h3>{{ data }}</h3>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to FSOnline-myVue.',
      info: '',
      data: ''
    }
  },
  created () {
    let self = this;
    this.$http.get('/getData').then(res => {
      let data = res.data;
      if(JSON.parse(res.request.response).code === 200){
        self.info = data.data;
      } else {
        console.log(data.message);
      }
    });
    this.$http.get('/getDBData', { params:{ data: 'admin' } }).then(res => {
      let data = res.data;
      if(JSON.parse(res.request.response).code === 200){
        self.data = data.data;
      } else {
        console.log(data.message);
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;

  li {
    display: inline-block;
    margin: 0 10px;

    a {
      color: #42b983;
    }

  }

}
</style>
