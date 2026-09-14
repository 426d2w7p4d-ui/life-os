import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
export function NotFoundPage(){const nav=useNavigate();return <div className="page"><PageHeader title="这个页面走丢了" subtitle="返回首页继续整理生活。"/><button className="btn primary" onClick={()=>nav('/')}>回到今天</button></div>}
