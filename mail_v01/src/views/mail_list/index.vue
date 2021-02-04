<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button
        v-if="searchType === 'deleted'"
        v-waves
        size="small"
        @click="unDeleted"
        type="primary"
        class="tool-item filter-item btn-add"
      >
        <i class="fa fa-undo" aria-hidden="true"></i>
      </el-button>
      <el-button
        v-waves
        size="small"
        @click="forward"
        type="primary"
        class="tool-item filter-item btn-forward"
      >
        <i class="fa fa-share-alt" aria-hidden="true"></i>
      </el-button>
      <el-button
        v-waves
        size="small"
        type="danger"
        class="tool-item filter-item btn-del"
        v-on:click="handleDelete()"
      >
        <i class="fa fa-trash" aria-hidden="true"></i>
      </el-button>
      <el-button
        v-waves
        size="small"
        type="primary"
        class="tool-item filter-item btn-reload"
        v-on:click="getList"
      >
        <i class="fa fa-refresh" aria-hidden="true"></i>
      </el-button>
      <el-input
        @keyup.enter.native="handleFilter"
        style="width: 200px;"
        size="small"
        class="filter-item"
        placeholder="标题"
        v-model="listQuery.title"
      ></el-input>
      <el-select
        clearable
        style="width: 90px"
        size="small"
        class="filter-item"
        v-model="listQuery.type"
        placeholder="类型"
      >
        <el-option
          v-for="type in typeOptions"
          :key="type.value"
          :label="type.showValue"
          :value="type.value"
        ></el-option>
      </el-select>
      <span style="font-size: small;">选择时间范围:</span>
      <el-date-picker
        v-model="dateRange"
        size="small"
        type="datetimerange"
        :picker-options="dateOptions"
        align="right"
        class="tool-item"
      ></el-date-picker>
      <el-button class="filter-item" size="small" type="primary" v-waves @click="handleFilter">
        <i class="fa fa-search" aria-hidden="true" style="color: #FFFFFF; margin-right: 8px;"/>
        <span>搜索</span>
      </el-button>
      <el-button class="filter-item" size="small" type="text" @click="handleDownload">
        <i class="fa fa-download" aria-hidden="true" style="color: #5EB3FF; margin-right: 8px;"/>
        <span>导出</span>
      </el-button>
    </div>
    <el-table
      :data="list"
      ref="multipleTable"
      @sort-change="customSort"
      @selection-change="handleSelectionChange"
      v-loading.body="listLoading"
      border=""
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="selection" min-width="30px"></el-table-column>
      <el-table-column align="left" width="90px" label="信息">
        <template slot-scope="scope">
          <i style="color: #F08A5D;margin: 5px" :class="scope.row.isStar? 'fa fa-star':'fa fa-star-o'" aria-hidden="true"></i>
          <i v-if="scope.row.isHaveFile" style="color: #11999E;margin: 5px" class="fa fa-bookmark" aria-hidden="true"></i>
          <i v-if="scope.row.isHaveAudio" style="margin: 5px" class="fa fa-microphone" aria-hidden="true"></i>
        </template>
      </el-table-column>
      <el-table-column class="status-col" label="类型" width="90px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeFilter">{{scope.row.type | typeShowFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发件人">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.sendMail" placement="top">
            <span>{{scope.row.sendName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="主题" :show-overflow-tooltip="true" min-width="500px">
        <template slot-scope="scope">
          <span class="link-type" @click="goToDetail(scope.row)">{{scope.row.title}}</span>
          <el-tag v-for="label in scope.row.labelList" :key="label.guid">{{label.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="date" sortable="custom" align="center" label="时间" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.date | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import * as mailListAPI from '../../api/mail_list';
import { parseTime } from '../../utils';

export default {
  name: 'mail_list',
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        title: '',
        type: '',
        startDate: null,
        stopDate: null,
        sort: '',
        order: '',
        routeQuery: {}
      },
      dateRange: [],
      multipleSelection: [],
      typeOptions: [
        {
          value: 'receive',
          showValue: '收件'
        },
        {
          value: 'send',
          showValue: '发件'
        }
      ],
      dateOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      searchType: null
    };
  },
  created() {
    this.searchType = this.$route.params.labelId ? 'labelId' : 'deleted';
    this.getList();
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        receive: 'primary',
        send: 'success'
      };
      return typeMap[type];
    },
    typeShowFilter(type) {
      const typeShowMap = {
        receive: '收件',
        send: '发件'
      };
      return typeShowMap[type];
    },
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  methods: {
    getList() {
      this.listQuery.startDate = this.dateRange[0]
        ? this.dateRange[0].getTime()
        : null;
      this.listQuery.stopDate = this.dateRange[1]
        ? this.dateRange[1].getTime()
        : null;
      Object.assign(
        this.listQuery.routeQuery,
        this.$route.params,
        this.$route.meta
      );
      mailListAPI.fetchList(this.listQuery).then(res => {
        this.list = res.data.items;
        this.total = res.data.total;
      });
    },
    goToDetail(row) {
      this.$store.commit('SET_MAIL_ID', row.id);
      this.$store.commit('SET_MAIL_TYPE', row.type);
      this.$router.push({ path: '/mail_detail/index' });
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    customSort(sortObj) {
      this.listQuery.sort = sortObj.prop;
      this.listQuery.order = sortObj.order;
      this.getList();
    },
    forward() {
      const selectedLen = this.multipleSelection.length || 0;
      if (selectedLen !== 1) {
        this.$message('请选择一封邮件进行转发');
        return;
      }
      this.$store.commit('SET_MAIL_ID', this.multipleSelection[0].id);
      this.$store.commit('SET_PAGE_TYPE', 'forward');
      this.$store.commit('SET_MAIL_TYPE', this.multipleSelection[0].type);
      this.$router.push({ path: '/mail_send/index' });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete() {
      const selectedLen = this.multipleSelection.length || 0;
      if (selectedLen < 1) {
        this.$message('请选择邮件进行删除');
        return;
      }
      this.$confirm('是否删除这' + selectedLen + '封邮件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const idArr = [];
          this.multipleSelection.forEach(item => idArr.push(item.id));
          // 删除的时候业务可能要求带上类型，类型在multipleSelection.type
          mailListAPI.delMail(idArr).subscribe({
            next: () => {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            },
            error: () =>
              this.$message({
                showClose: true,
                message: '删除失败',
                type: 'error'
              })
          });
        })
        .catch(() => {
          this.$message('操作已取消');
        });
    },
    unDeleted() {
      const selectedLen = this.multipleSelection.length || 0;
      if (selectedLen < 1) {
        this.$message('请选择邮件撤销删除');
        return;
      }
      const idArr = [];
      this.multipleSelection.forEach(item => idArr.push(item.id));
      // 业务可能要求带上类型，类型在multipleSelection.type
      mailListAPI.unDoDelMail(idArr).subscribe({
        next: () => {
          this.$message({
            message: '撤销删除成功',
            type: 'success',
            duration: 2000
          });
          this.getList();
        },
        error: () =>
          this.$message({
            showClose: true,
            message: '撤销删除失败',
            type: 'error'
          })
      });
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel');
        const tHeader = ['发件人', '发件邮箱', '主题', '时间'];
        const filterVal = ['sendName', 'sendMail', 'title', 'date'];
        const data = this.formatJson(filterVal, this.list);
        export_json_to_excel(
          tHeader,
          data,
          parseTime(Date.now()) + '邮件列表数据'
        );
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (~j.indexOf('date')) {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.star {
  color: #f08a5d;
}

</style>
