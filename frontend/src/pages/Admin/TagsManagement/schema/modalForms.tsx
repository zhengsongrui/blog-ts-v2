import { Form, Input } from "antd";

export const renderTagForm = () => {
  return (
    <>
      <Form.Item
        label="标签名称"
        name="name"
        rules={[{ required: true, message: "请输入标签名称" }, { max: 50, message: "名称不能超过50个字符" }]}
      >
        <Input placeholder="请输入标签名称" />
      </Form.Item>

      <Form.Item
        label="标签Slug"
        name="slug"
        rules={[
          { required: true, message: "请输入标签Slug" },
          { pattern: /^[a-z0-9\-]+$/, message: "Slug只能包含小写字母、数字和连字符" },
        ]}
      >
        <Input placeholder="例如: technology" />
      </Form.Item>
    </>
  );
};
