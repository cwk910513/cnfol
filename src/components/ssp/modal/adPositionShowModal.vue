<style scoped lang='scss'>
    .ant-form-item {
        margin-bottom: 0px;
    }
</style>

<template>
    <a-form>
        <a-form-item
            label='广告位ID：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.id || '-'  }}
        </a-form-item>
        <a-form-item
            label='媒体主：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.openUserName || '-'  }}
        </a-form-item>
        <a-form-item
            label='广告位名称：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.adPositionName || '-'  }}
        </a-form-item>
        <a-form-item
            label='所属应用：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.appName || '-'  }}
        </a-form-item>
        <a-form-item
            label='广告位类型：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.adPositionTypeName || '-'  }}
        </a-form-item>
        <a-form-item
            label='文字链字数限制：'
            v-if="adPositionItem.adPositionTypeId == 5"
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.textMin }} ~ {{ adPositionItem.textMax }}
        </a-form-item>
        <a-form-item
            label='广告位尺寸：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.adPositionSize || '-'  }}
        </a-form-item>
        <a-form-item
            label='图片格式：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.picFormatList || '-' }}
        </a-form-item>
        <a-form-item
            label='图片大小限制：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.picMax }} KB
        </a-form-item>
        <a-form-item
            label='广告标题长度限制：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.titleMin }} ~ {{ adPositionItem.titleMax }}
        </a-form-item>
        <a-form-item
            label='推广文案字数限制：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.cwMin }} ~ {{ adPositionItem.cwMax }}
        </a-form-item>
        <a-form-item
            label='交互方式：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.interactTypeList || '-' }}
        </a-form-item>
        <a-form-item
            label='视频大小限制：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.audMax }} MB
        </a-form-item>
        <a-form-item
            label='视频长度限制：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.audTimeMin }} ~ {{ adPositionItem.audTimeMin }} s
        </a-form-item>
        <a-form-item
            label='音频大小限制：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.vidMax }} MB
        </a-form-item>
        <a-form-item
            label='音频长度限制：'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
        >
            {{ adPositionItem.vidTimeMin }} ~ {{ adPositionItem.vidTimeMax }} s
        </a-form-item>
    </a-form>
</template>

<script>
    // 表单中每一行的布局
    const formItemLayout = {
        labelCol  : { span: 7 },
        wrapperCol: { span: 16 }
    };

    export default {
        data () {
            return {
                formItemLayout
            }
        },
        props: [
            'adPositionItem'
        ]
    }
</script>
