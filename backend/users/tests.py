from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserModelTest(TestCase):
    """Test cases for CustomUser model"""
    
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'role': User.roles.PROFESOR,
            'matricule': 'MAT123'
        }
    
    def test_create_user(self):
        """Test creating a user with valid data"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.role, User.roles.PROFESOR)
        self.assertEqual(user.matricule, 'MAT123')
        self.assertTrue(user.check_password('TestPass123!'))
    
    def test_create_admin_user(self):
        """Test creating an admin user"""
        admin_data = self.user_data.copy()
        admin_data['role'] = User.roles.ADMIN
        admin = User.objects.create_user(**admin_data)
        self.assertEqual(admin.role, User.roles.ADMIN)
    
    def test_user_string_representation(self):
        """Test user string representation"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), 'testuser')
    
    def test_email_uniqueness(self):
        """Test that email must be unique"""
        User.objects.create_user(**self.user_data)
        duplicate_data = self.user_data.copy()
        duplicate_data['username'] = 'different_user'
        with self.assertRaises(Exception):
            User.objects.create_user(**duplicate_data)


class UserRegistrationTest(APITestCase):
    """Test cases for user registration endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.valid_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'SecurePass123!',
            'password2': 'SecurePass123!',
            'role': 'PROFESSOR',
            'first_name': 'John',
            'last_name': 'Doe',
            'matricule': 'MAT456'
        }
    
    def test_register_user_success(self):
        """Test successful user registration"""
        response = self.client.post(self.register_url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertEqual(response.data['user']['username'], 'newuser')
        self.assertEqual(response.data['user']['email'], 'newuser@example.com')
    
    def test_register_user_password_mismatch(self):
        """Test registration fails when passwords don't match"""
        data = self.valid_data.copy()
        data['password2'] = 'DifferentPass123!'
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_register_user_duplicate_email(self):
        """Test registration fails with duplicate email"""
        self.client.post(self.register_url, self.valid_data, format='json')
        duplicate_data = self.valid_data.copy()
        duplicate_data['username'] = 'anotheruser'
        response = self.client.post(self.register_url, duplicate_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_register_user_duplicate_username(self):
        """Test registration fails with duplicate username"""
        self.client.post(self.register_url, self.valid_data, format='json')
        duplicate_data = self.valid_data.copy()
        duplicate_data['email'] = 'different@example.com'
        response = self.client.post(self.register_url, duplicate_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_user_missing_required_fields(self):
        """Test registration fails with missing required fields"""
        response = self.client.post(self.register_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertIn('email', response.data)
        self.assertIn('password', response.data)
    
    def test_register_user_weak_password(self):
        """Test registration fails with weak password"""
        data = self.valid_data.copy()
        data['password'] = '123'
        data['password2'] = '123'
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_user_invalid_role(self):
        """Test registration fails with invalid role"""
        data = self.valid_data.copy()
        data['role'] = 'INVALID_ROLE'
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserLoginTest(APITestCase):
    """Test cases for user login endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.login_url = '/api/auth/login/'
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!',
            role=User.roles.PROFESOR
        )
    
    def test_login_success(self):
        """Test successful login"""
        data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertEqual(response.data['message'], 'Login successful')
    
    def test_login_invalid_credentials(self):
        """Test login fails with invalid credentials"""
        data = {
            'username': 'testuser',
            'password': 'WrongPassword123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)
    
    def test_login_nonexistent_user(self):
        """Test login fails with nonexistent user"""
        data = {
            'username': 'nonexistent',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_inactive_user(self):
        """Test login fails for inactive user"""
        self.user.is_active = False
        self.user.save()
        data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('error', response.data)
    
    def test_login_missing_fields(self):
        """Test login fails with missing fields"""
        response = self.client.post(self.login_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserLogoutTest(APITestCase):
    """Test cases for user logout endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.logout_url = '/api/auth/logout/'
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.refresh = RefreshToken.for_user(self.user)
        self.access_token = str(self.refresh.access_token)
        self.refresh_token = str(self.refresh)
    
    def test_logout_success(self):
        """Test successful logout"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {'refresh_token': self.refresh_token}
        response = self.client.post(self.logout_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Logout successful')
    
    def test_logout_without_authentication(self):
        """Test logout fails without authentication"""
        data = {'refresh_token': self.refresh_token}
        response = self.client.post(self.logout_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_logout_missing_refresh_token(self):
        """Test logout fails without refresh token"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(self.logout_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserProfileTest(APITestCase):
    """Test cases for user profile endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.profile_url = '/api/auth/profile/'
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!',
            first_name='John',
            last_name='Doe',
            matricule='MAT123'
        )
        self.refresh = RefreshToken.for_user(self.user)
        self.access_token = str(self.refresh.access_token)
    
    def test_get_profile_success(self):
        """Test retrieving user profile"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
        self.assertEqual(response.data['user']['email'], 'test@example.com')
    
    def test_get_profile_without_authentication(self):
        """Test profile retrieval fails without authentication"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_profile_success(self):
        """Test updating user profile"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'newemail@example.com'
        }
        response = self.client.patch(self.profile_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['first_name'], 'Jane')
        self.assertEqual(response.data['user']['last_name'], 'Smith')
        self.assertEqual(response.data['user']['email'], 'newemail@example.com')
    
    def test_update_profile_without_authentication(self):
        """Test profile update fails without authentication"""
        data = {'first_name': 'Jane'}
        response = self.client.patch(self.profile_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ChangePasswordTest(APITestCase):
    """Test cases for password change endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.change_password_url = '/api/auth/change-password/'
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='OldPass123!'
        )
        self.refresh = RefreshToken.for_user(self.user)
        self.access_token = str(self.refresh.access_token)
    
    def test_change_password_success(self):
        """Test successful password change"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            'old_password': 'OldPass123!',
            'new_password': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        response = self.client.post(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Password changed successfully')
        
        # Verify new password works
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPass123!'))
    
    def test_change_password_wrong_old_password(self):
        """Test password change fails with wrong old password"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            'old_password': 'WrongPass123!',
            'new_password': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        response = self.client.post(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_change_password_mismatch(self):
        """Test password change fails when new passwords don't match"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            'old_password': 'OldPass123!',
            'new_password': 'NewPass123!',
            'new_password2': 'DifferentPass123!'
        }
        response = self.client.post(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_change_password_without_authentication(self):
        """Test password change fails without authentication"""
        data = {
            'old_password': 'OldPass123!',
            'new_password': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        response = self.client.post(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserListTest(APITestCase):
    """Test cases for user list endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.users_url = '/api/auth/users/'
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='Pass123!'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='Pass123!'
        )
        self.refresh = RefreshToken.for_user(self.user1)
        self.access_token = str(self.refresh.access_token)
    
    def test_list_users_success(self):
        """Test listing all users"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.users_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('count', response.data)
        self.assertEqual(response.data['count'], 2)
    
    def test_list_users_without_authentication(self):
        """Test user list fails without authentication"""
        response = self.client.get(self.users_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TokenRefreshTest(APITestCase):
    """Test cases for token refresh endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.refresh_url = '/api/auth/token/refresh/'
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.refresh = RefreshToken.for_user(self.user)
        self.refresh_token = str(self.refresh)
    
    def test_refresh_token_success(self):
        """Test successful token refresh"""
        data = {'refresh': self.refresh_token}
        response = self.client.post(self.refresh_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_refresh_token_invalid(self):
        """Test token refresh fails with invalid token"""
        data = {'refresh': 'invalid_token'}
        response = self.client.post(self.refresh_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_refresh_token_missing(self):
        """Test token refresh fails without token"""
        response = self.client.post(self.refresh_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PermissionsTest(APITestCase):
    """Test cases for custom permissions"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='AdminPass123!',
            role=User.roles.ADMIN
        )
        self.professor_user = User.objects.create_user(
            username='professor',
            email='prof@example.com',
            password='ProfPass123!',
            role=User.roles.PROFESOR
        )
    
    def test_admin_role_assignment(self):
        """Test admin role is correctly assigned"""
        self.assertEqual(self.admin_user.role, User.roles.ADMIN)
    
    def test_professor_role_assignment(self):
        """Test professor role is correctly assigned"""
        self.assertEqual(self.professor_user.role, User.roles.PROFESOR)
