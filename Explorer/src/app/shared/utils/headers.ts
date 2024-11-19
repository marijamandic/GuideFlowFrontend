import { HttpHeaders } from '@angular/common/http';

export default new HttpHeaders({
	Authorization: `Bearer ${localStorage.getItem('access-token')}`,
	'Content-Type': 'application-json'
});
