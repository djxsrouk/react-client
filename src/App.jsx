import "./App.css";
import { useEffect, useState } from "react";
import {
  Card,
  Spin,
  Row,
  Col,
  Form,
  Button,
  Input,
  InputNumber,
  Slider,
} from "antd";
const { Meta } = Card;

const imageNotFoundUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019";
const MIN_VALUE = 0;
const MAX_VALUE = 20000;

function App() {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [minLimit, setMinLimit] = useState(MIN_VALUE);
  const [maxLimit, setMaxLimit] = useState(MAX_VALUE);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/items?priceMin=${minLimit}&priceMax=${maxLimit}`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [minLimit, maxLimit]);

  const onFinish = async (newProductData) => {
    const response = await fetch("http://localhost:3000/items", {
      method: "POST",
      body: JSON.stringify(newProductData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resultText = await response.text();
    const result = resultText ? JSON.parse(resultText) : {};

    setData([...data, result]);
  };

  const onChangeSlider = (limits) => {
    setMinLimit(limits[0]);
    setMaxLimit(limits[1]);
  };

  return (
    <>
      <h1>Apple Shop List</h1>

      <Slider
        range
        min={MIN_VALUE}
        max={MAX_VALUE}
        defaultValue={[MIN_VALUE, MAX_VALUE]}
        step={50}
        onChange={onChangeSlider}
      />

      <Row gutter={16}>
        {data.length === 0 ? (
          <Col span={24}>
            <Spin size="large" />
          </Col>
        ) : (
          data.map((item) => (
            <Col className="gutter-row" span={6}>
              <Card
                hoverable
                style={{
                  width: 240,
                }}
                cover={
                  <img alt="example" src={item.imageLink ?? imageNotFoundUrl} />
                }
              >
                <Meta title={item.name} description={item.description} />
                <p>{item.price} RON</p>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: false,
        }}
        onFinish={onFinish}
        onFinishFailed={() => alert("Finish Failed!")}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input product name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: false,
              message: "Please input a description!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Image"
          name="imageLink"
          rules={[
            {
              type: "url",
              warningOnly: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Please input product price!",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default App;
