<div align="center">
  <a href="https://thepao-app.auxo.fund" target="_blank">
      <img alt="logo" src="./public/the-pao-logo-light.webp" width="200" />
  </a>
  <h1>
    The PAO Protocol
  </h1>
</div>

---

### Run

```shell
npm install
npm start
```

### Redux

- Chương trình dùng [Redux](https://redux.js.org/) và [Redux toolkit](https://redux-toolkit.js.org/) để quản lý một cách hiệu quả sate trong chương trình
- Ý nghĩa của các Slice được sử dụng trong chương trình sẽ được nói rõ bằng bảng dưới đây

| Slice                                             | Ý nghĩa                                                                                                       |
| :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------ |
| [ConfigSlice](./src/redux/configSlice.js)         | Chứa tất cả các Config về mạng, các địa chỉ(địa chỉ contract, địa chỉ tokens) được sử dụng trong chương trình |
| [UserConfigSlice](./src/redux/userConfigSlice.js) | Chứa các config của người dùng(theme mode, phân quyền), slice còn tham gia vào luồng xác thực người dùng      |
