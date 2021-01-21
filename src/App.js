import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Button, Form, Modal } from "react-bootstrap";

// modal
function MyVerticallyCenteredModal(props) {
  const [name, setName] = useState('');
  const [des, setDes] = useState('');
  const [urlImage, setUrl] = useState('');
  const [quantity, setQuantity] = useState(0);


  const editItem = (data, index, newData) => {
    for (var i = 0; i < data.length; i++) {
      if (data[i].productID == index) {
        data[i] = newData;
      }
    }
    return data;
  }

  const onHandleSubmit = (e) => {
    e.preventDefault();
    console.log("name: " + name);
    if (props.action == 'editItem') {
      var itemsDidUpdate = {
        productID: props.itemModify.productID,
        name: name && name,
        des: des && des,
        urlImage: urlImage && urlImage,
        quantity: quantity && quantity
      }
      var newData = editItem(props.data, props.itemModify.productID, itemsDidUpdate);
      props.setData(newData);
      axios.post('/api/edit', itemsDidUpdate);
    }
    else {
      const newProduct = {
        productID: '',
        name: name,
        des: des,
        urlImage: urlImage,
        quantity: quantity
      };
      var products = [...props.data, newProduct];
      props.setData(products);
      axios.post('/api/insert', newProduct).then(res => {

      })
    }
    props.onHide();
  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Thêm mới sản phẩm
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onHandleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Tên sản phẩm</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tên sản phẩm"
              onChange={e => setName(e.target.value)}
              defaultValue={props.itemModify && props.itemModify.name}
              name='name'
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Miêu tả</Form.Label>
            <Form.Control
              type="text"
              placeholder="Miêu tả"
              onChange={(e) => setDes(e.target.value)}
              defaultValue={props.itemModify && props.itemModify.des}
              name='des'
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              min={1}
              placeholder="Số lượng"
              onChange={(e) => setQuantity(e.target.value)}
              defaultValue={props.itemModify && props.itemModify.quantity}
              name='quantity'
              value={props.itemModify && props.itemModify.quantity}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Đường dẫn ảnh</Form.Label>
            <Form.Control
              type="text"
              placeholder="Đường dẫn ảnh"
              onChange={(e) => setUrl(e.target.value)}
              defaultValue={props.itemModify && props.itemModify.urlImage}
              name='urlImage'
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {
              props.action == 'editItem' ? 'Cập nhật' : 'Thêm mới'
            }
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
}
// end modal
function App() {
  const [data, setData] = useState([]);
  const [checkActive, setCheckActive] = useState('Home');
  const [modalShow, setModalShow] = useState(false);
  const [action, setAction] = useState('');
  const [itemModify, setItemModify] = useState(null);

  useEffect(() => {
    // get all item in mysql
    axios.get('/api/news').then(res => {
      setData(res.data.news);
    })
    return () => {
    }
  }, [])
  // funtion change active class
  const handleClick = (name) => {
    setCheckActive(name);
  }

  // function add new item
  const addItem = () => {
    setModalShow(true);
    setAction("addItem");
    setItemModify(null);
  }
  // function edit item
  const editItem = (item) => {
    setModalShow(true);
    setAction("editItem");
    setItemModify(item);

  }
  // funtion get data from modal
  const setDataProduct = (data) => {
    setData(data);
  }
  // function delete item
  const deleteItem = (productID) => {
    var confirm = window.confirm('Bạn có muốn xóa sản phẩm này không?');
    if (confirm == true) {
      // delete item in UI 
      var newItems = data.filter(item => item.productID != productID);
      setData(newItems);
      // delete item in mysql
      axios.post('/api/delete', { productID });
    }
  }
  return (
    <div className="App">

      <ul>
        <li onClick={() => handleClick("Home")} className={checkActive == "Home" ? 'active' : ''}><a>Home</a></li>
        <li onClick={() => handleClick("Product")} className={checkActive == "Product" ? 'active' : ''}><a>Product</a></li>
        <li onClick={() => handleClick("Order")} className={checkActive == "Order" ? 'active' : ''}><a>Order</a></li>
        <li onClick={() => handleClick("Account")} className={checkActive == "Account" ? 'active' : ''}><a>Account</a></li>
      </ul>
      <div className="tableContent">
        <Button onClick={addItem}>Thêm mới</Button>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Name</th>
              <th>Des</th>
              <th>urlImage</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((val, index) => (

                <tr key={index}>
                  <td>{index}</td>
                  <td>{val.name}</td>
                  <td>{val.des}</td>
                  <td>{val.urlImage}</td>
                  <td>{val.quantity}</td>
                  <th>
                    <Button onClick={() => editItem(val)} variant='outline-primary'>Edit</Button>
                    <Button onClick={() => deleteItem(val.productID)} variant='outline-danger'>Delete</Button>
                  </th>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={data}
        setData={(data) => setDataProduct(data)}
        action={action}
        itemModify={itemModify}
      />
    </div >
  );
}

export default App;
