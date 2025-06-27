import { Routes } from '@angular/router';
import {Login} from './auth/login/login';
import {Register} from './auth/register/register';
import {RegisterLab} from './labs/register-lab/register-lab';
import {UploadDocuments} from './labs/upload-documents/upload-documents';
import {ManageProductUnits} from './products/manage-product-units/manage-product-units';
import {ManageBatches} from './batches/manage-batches/manage-batches';
import {RegisterEvent} from './events/register-event/register-event';
import {ViewAlerts} from './alerts/view-alerts/view-alerts';
import {TraceProduct} from './traceability/trace-product/trace-product';

export const routes: Routes = [

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register-lab', component: RegisterLab },
  { path: 'upload-documents', component: UploadDocuments },
  { path: 'manage-product-units', component: ManageProductUnits },
  { path: 'manage-batches', component: ManageBatches },
  { path: 'register-event', component: RegisterEvent },
  { path: 'view-alerts', component: ViewAlerts },
  { path: 'trace-product', component: TraceProduct },


  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }


];
