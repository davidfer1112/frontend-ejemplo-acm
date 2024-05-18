import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService} from '../../services/item.service';
import { Item } from '../../models/ItemModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService
  ) {
    this.itemForm = this.fb.group({
      name: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.itemService.getItem(Number(id)).subscribe((data) => {
        this.itemForm.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.itemService.updateItem(id, this.itemForm.value).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.itemService.createItem(this.itemForm.value).subscribe(() => {
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      });
    }
  }
}
