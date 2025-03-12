import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import { XssComponent } from './pages/tests/xss/xss.component';
import { BrokenAuthComponent } from './pages/tests/broken-auth/broken-auth.component';
import {BrokenAccessControlComponent} from './pages/tests/broken-access-control/broken-access-control.component';
import {CryptoFailComponent} from './pages/tests/crypto-fail/crypto-fail.component';
import {SSRFComponent} from './pages/tests/ssrf/ssrf.component';
import {PathTraversalComponent} from './pages/tests/path-traversal/path-traversal.component';
import {RemoteCodeExecutionComponent} from './pages/tests/remote-code-execution/remote-code-execution.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tests/broken-access-control', component: BrokenAccessControlComponent },
  { path: 'tests/broken-access-control/:user_id', component: BrokenAccessControlComponent },
  { path: 'tests/xss', component: XssComponent },
  { path: 'tests/broken-auth', component: BrokenAuthComponent },
  { path: 'tests/crypto-fail', component: CryptoFailComponent },
  { path: 'tests/ssrf', component: SSRFComponent },
  { path: 'tests/path_traversal', component: PathTraversalComponent },
  { path: 'tests/rce', component: RemoteCodeExecutionComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Fallback
];
