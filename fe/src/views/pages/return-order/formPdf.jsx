import React, { forwardRef, useState, useEffect } from 'react';
import { Card, Table, Typography } from 'antd';
import FormatCurrency from 'views/utilities/FormatCurrency';

import axios from "axios";
const { Title, Text } = Typography;

const EmailTemplate = forwardRef(({ billReturn, billDetailReturn, tongTienTraKhach }, ref) => {

    console.log("");

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'nameProduct',
        },
        {
            title: 'Số lượng trả',
            dataIndex: 'quantity',
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            render: (text) => <FormatCurrency value={text} />,
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            render: (text, record) => <FormatCurrency value={record.price * record.quantity} />,
        },
    ];
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
    
    
    return (
        <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', padding: '20px' }}>
            <Card style={{ backgroundColor: '#6A0DAD', color: 'white', borderRadius: '10px' }}>
                <Title level={1} style={{ textAlign: 'center', color: 'white' }}>
                    Cảm ơn bạn đã liên hệ với Berry Store!
                </Title>
            </Card>
            <Card style={{ marginTop: '20px', borderRadius: '10px' }}>
                <Text>Kính gửi: <strong>{billReturn.nameCustomer}</strong>,</Text>
                <Text>Ngày xác nhận: <strong>{formattedDate}</strong>,</Text>
                <Text>Tổng số tiền trả hàng: <strong><FormatCurrency value={tongTienTraKhach} /></strong>,</Text>

                <Text> Cảm ơn bạn đã thông báo về việc trả hàng. Dưới đây là thông tin chi tiết về yêu cầu trả hàng của bạn:</Text>

                <Title level={3}>Thông tin trả hàng</Title>
                <Table
                    dataSource={[billReturn]}
                    pagination={false}
                    rowKey="codeBill"
                    style={{ marginBottom: '20px' }}
                >
                    <Table.Column title="Mã hóa đơn" dataIndex="codeBill" />
                    <Table.Column title="Ngày yêu cầu trả hàng"
                        render={(text) => <span className="highlight">{formattedDate}</span>} />
                    <Table.Column
                        title="Tổng số tiền hoàn trả"

                        render={(text) => <span className="highlight"><FormatCurrency value={tongTienTraKhach} /></span>}
                    />
                </Table>

                <Title level={3}>Chi tiết sản phẩm trả hàng</Title>
                <Table
                    dataSource={billDetailReturn}
                    columns={columns}
                    pagination={false}
                    rowKey="id"
                />

                <Text>Chúng tôi sẽ xem xét yêu cầu trả hàng của bạn và sẽ liên hệ lại sớm nhất có thể.</Text>
                <Text>Thông tin đơn hàng bạn sẽ xem <a href={`http://localhost:3000/tracking/${billReturn.codeBill}`} className='track-link'>Tại đây</a>.</Text>
                <hr />
                <Text>Cảm ơn quý khách và hẹn gặp lại!</Text>
                <Text>Hotline: <strong>0393977745</strong></Text>
                <Text>Trường cao đẳng FPT Polytechnic, P.Trịnh Văn Bô, P.Phương Canh, Q.Nam Từ Liêm, TP.Hà Nội</Text>
                <Text>Trân trọng,</Text>
                <Text><strong>Berry Store</strong></Text>
            </Card>
        </div>
    );
});

export default EmailTemplate;
