let users = [
  {
    id: '1',
    email: 'admin@test.com',
    password: '$2a$10$Nj75ZTaCYnQtiA7JJX1d/equi4nAuCIkalNXBWPdMfxnCn5z/My1y',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '2',
    email: 'user@test.com',
    password: '$2a$10$Y4xlvrVpDB6dWYUHVi8JvOxvwb50IvOQCXpCuCclSumJcLRsw53GS',
    name: 'Regular User',
    role: 'user',
    createdAt: new Date('2024-01-02').toISOString()
  }
];

module.exports = users;
