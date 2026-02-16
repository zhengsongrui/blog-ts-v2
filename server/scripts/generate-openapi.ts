#!/usr/bin/env node
/**
 * OpenAPI 文档生成工具
 * 
 * 自动从 Express 路由文件生成 OpenAPI 3.0 规范文档。
 * 支持解析路由注释、JSDoc 文档、认证要求和响应格式。
 * 
 * 使用方法：
 *   npm run generate:openapi
 *   node scripts/generate-openapi.ts --output docs/openapi.yaml
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { parseRouteFile } from './lib/route-parser';
import { generateOpenAPISpec } from './lib/openapi-generator';

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const outputPath = getOutputPath(args);
  
  console.log('🚀 开始生成 OpenAPI 文档...');
  console.log(`📁 输出路径: ${outputPath}`);
  
  try {
    // 1. 解析所有路由文件
    const routes = await parseAllRoutes();
    
    // 2. 生成 OpenAPI 规范
    const openapiSpec = generateOpenAPISpec(routes);
    
    // 3. 写入文件
    await writeOutput(openapiSpec, outputPath);
    
    // 4. 验证生成的文件
    await validateOutput(outputPath);
    
    console.log('✅ OpenAPI 文档生成完成！');
    console.log(`📄 文档已保存至: ${outputPath}`);
    console.log(`🌐 可通过 http://localhost:3000/api-docs 访问`);
    
  } catch (error) {
    console.error('❌ 生成 OpenAPI 文档时发生错误:');
    console.error(error);
    process.exit(1);
  }
}

/**
 * 获取输出路径
 */
function getOutputPath(args: string[]): string {
  const outputIndex = args.indexOf('--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    return args[outputIndex + 1];
  }
  
  // 默认输出路径
  return path.join(__dirname, '..', 'docs', 'openapi.yaml');
}

/**
 * 解析所有路由文件
 */
async function parseAllRoutes(): Promise<any[]> {
  const routesDir = path.join(__dirname, '..', 'src', 'routes');
  const routeFiles = [
    'user-routes.ts',
    'post-routes.ts', 
    'category-routes.ts',
    'tag-routes.ts'
  ];
  
  const allRoutes: any[] = [];
  
  for (const file of routeFiles) {
    const filePath = path.join(routesDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  路由文件不存在: ${filePath}`);
      continue;
    }
    
    console.log(`📄 解析路由文件: ${file}`);
    const routes = await parseRouteFile(filePath);
    allRoutes.push(...routes);
  }
  
  console.log(`📊 共解析 ${allRoutes.length} 个路由`);
  return allRoutes;
}

/**
 * 写入输出文件
 */
async function writeOutput(spec: any, outputPath: string): Promise<void> {
  // 确保目录存在
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // 根据扩展名决定格式
  if (outputPath.endsWith('.yaml') || outputPath.endsWith('.yml')) {
    const yamlContent = yaml.dump(spec, {
      lineWidth: 120,
      noRefs: true,
      noCompatMode: true,
    });
    fs.writeFileSync(outputPath, yamlContent, 'utf8');
  } else if (outputPath.endsWith('.json')) {
    const jsonContent = JSON.stringify(spec, null, 2);
    fs.writeFileSync(outputPath, jsonContent, 'utf8');
  } else {
    throw new Error(`不支持的输出格式: ${outputPath}`);
  }
}

/**
 * 验证输出文件
 */
async function validateOutput(outputPath: string): Promise<void> {
  if (!fs.existsSync(outputPath)) {
    throw new Error(`输出文件不存在: ${outputPath}`);
  }
  
  const content = fs.readFileSync(outputPath, 'utf8');
  const spec = yaml.load(content) as any;
  
  // 基本验证
  if (!spec.openapi) {
    throw new Error('生成的文档缺少 openapi 版本');
  }
  
  if (!spec.info || !spec.info.title) {
    throw new Error('生成的文档缺少 info.title');
  }
  
  if (!spec.paths || Object.keys(spec.paths).length === 0) {
    console.warn('⚠️  生成的文档没有路径定义');
  }
  
  console.log(`✅ 文档验证通过: OpenAPI ${spec.openapi}, ${Object.keys(spec.paths || {}).length} 个路径`);
}

// 执行主函数
if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export { main };