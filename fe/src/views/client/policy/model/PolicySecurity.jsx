export default function PolicySecurity() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.8', padding: '20px', backgroundColor: '#f9f9f9' }}>
      {/* Header Section */}
      <section style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Chính sách bảo mật</h2>
      </section>

      {/* Introduction Section */}
      <section style={{ marginBottom: '30px', color: '#555' }}>
        <h3 style={{ fontSize: '20px', color: '#007BFF', marginBottom: '10px' }}>1. Giới thiệu</h3>
        <p>
          Chào mừng bạn đến với nền tảng dosi-in.com (bao gồm website{' '}
          <a 
            href="https://dosi-in.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#007BFF', textDecoration: 'none' }}>
            https://dosi-in.com
          </a>
          ) và ứng dụng di động DOSIIN, được vận hành bởi Công ty cổ phần Dosiin...
        </p>
        <p>
          "Dữ Liệu Cá Nhân" hay "dữ liệu cá nhân" có nghĩa là dữ liệu, dù đúng hay không, về một cá nhân mà thông qua đó có thể được xác định được danh tính...
        </p>
        <p>
          Bằng việc sử dụng Các Dịch Vụ, đăng ký một tài khoản với chúng tôi hoặc truy cập Nền tảng, bạn xác nhận và đồng ý rằng bạn chấp nhận các phương pháp, yêu cầu, và/hoặc chính sách được mô tả trong Chính sách bảo mật này...
        </p>
      </section>

      {/* Data Collection Section */}
      <section style={{ color: '#555' }}>
        <h3 style={{ fontSize: '20px', color: '#007BFF', marginBottom: '10px' }}>2. Khi nào Dosiin sẽ thu thập dữ liệu cá nhân</h3>
        <p style={{ marginBottom: '15px' }}>Chúng tôi sẽ/có thể thu thập dữ liệu cá nhân về bạn:</p>
        <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: '#333' }}>
          <li style={{ marginBottom: '10px' }}>
            Khi bạn đăng ký và/hoặc sử dụng Các Dịch Vụ hoặc Nền tảng của chúng tôi, hoặc mở một tài khoản với chúng tôi.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Khi bạn gửi bất kỳ biểu mẫu nào, bao gồm đơn đăng ký hoặc các mẫu đơn khác...
          </li>
          <li style={{ marginBottom: '10px' }}>
            Khi bạn ký kết bất kỳ thỏa thuận nào hoặc cung cấp các tài liệu hoặc thông tin khác liên quan...
          </li>
          <li style={{ marginBottom: '10px' }}>
            Khi bạn tương tác với chúng tôi, chẳng hạn như thông qua các cuộc gọi điện thoại (có thể được ghi âm lại)...
          </li>
          <li style={{ marginBottom: '10px' }}>
            Khi bạn sử dụng các dịch vụ điện tử của chúng tôi, hoặc tương tác với chúng tôi qua Nền tảng hoặc Trang Web...
          </li>
          <li style={{ marginBottom: '10px' }}>
            Khi bạn thực hiện các giao dịch thông qua Dịch vụ của chúng tôi.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Khi bạn cung cấp ý kiến phản hồi hoặc gửi khiếu nại cho chúng tôi.
          </li>
        </ul>
      </section>
    </div>
  );
}