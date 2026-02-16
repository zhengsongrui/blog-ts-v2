#!/usr/bin/env python3
import yaml
import sys
import os

def main():
    file_path = 'docs/openapi.yaml'
    if not os.path.exists(file_path):
        print(f"[ERROR] 文件不存在: {file_path}")
        sys.exit(1)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        
        print('[OK] YAML 解析成功')
        print(f"OpenAPI 版本: {data.get('openapi')}")
        print(f"API 标题: {data.get('info', {}).get('title')}")
        print(f"API 描述: {data.get('info', {}).get('description', '')[:50]}...")
        print(f"服务器数量: {len(data.get('servers', []))}")
        print(f"标签数量: {len(data.get('tags', []))}")
        print(f"路径数量: {len(data.get('paths', {}))}")
        print(f"组件模式数量: {len(data.get('components', {}).get('schemas', {}))}")
        
        # 检查关键路径是否存在
        expected_paths = [
            '/users/register',
            '/users/login',
            '/users/me',
            '/posts',
            '/posts/{id}',
            '/health'
        ]
        
        for path in expected_paths:
            if path in data.get('paths', {}):
                print(f"[OK] 路径存在: {path}")
            else:
                print(f"[WARN] 路径缺失: {path}")
        
        # 检查关键组件
        expected_schemas = [
            'User',
            'CreateUserDto',
            'LoginDto',
            'AuthResponse',
            'Post',
            'CreatePostDto',
            'ApiResponse',
            'ApiError'
        ]
        
        for schema in expected_schemas:
            if schema in data.get('components', {}).get('schemas', {}):
                print(f"[OK] 组件存在: {schema}")
            else:
                print(f"[WARN] 组件缺失: {schema}")
        
        # 验证安全方案
        security_schemes = data.get('components', {}).get('securitySchemes', {})
        if 'bearerAuth' in security_schemes:
            print('[OK] 安全方案存在: bearerAuth')
        else:
            print('[WARN] 安全方案缺失: bearerAuth')
        
        print('\n[OK] 文档验证完成')
        
    except yaml.YAMLError as e:
        print(f'[ERROR] YAML 解析错误: {e}')
        sys.exit(1)
    except Exception as e:
        print(f'[ERROR] 验证错误: {e}')
        sys.exit(1)

if __name__ == '__main__':
    main()